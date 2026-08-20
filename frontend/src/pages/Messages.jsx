import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/messages.css";

function Messages() {
  const [searchParams] = useSearchParams();

  const requestedUser = searchParams.get("user");
  const requestedJob = searchParams.get("job");

  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // Load all messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !user) {
        setError("Please login to view your messages.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/messages/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load messages"
          );
        }

        setMessages(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  // Create conversation list
  const conversations = [];

  messages.forEach((message) => {
    const otherUserId =
      Number(message.sender_id) === Number(user?.id)
        ? message.receiver_id
        : message.sender_id;

    const otherUserName =
      Number(message.sender_id) === Number(user?.id)
        ? message.receiver_name
        : message.sender_name;

    const key = `${otherUserId}-${message.job_id}`;

    if (!conversations.some((item) => item.key === key)) {
      conversations.push({
        key,
        userId: Number(otherUserId),
        name: otherUserName || "User",
        jobId: message.job_id,
        jobTitle: message.job_title || "Job discussion",
        company: message.company || "Company",
        lastMessage: message.message,
        sentAt: message.sent_at,
      });
    }
  });

  // Open a conversation
  const openConversation = async (
    userId,
    jobId,
    jobTitle,
    company,
    name
  ) => {
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/conversation/${userId}?job_id=${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load conversation"
        );
      }

      setConversation(data);

      setSelectedConversation({
        userId,
        jobId,
        jobTitle,
        company,
        name,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Open conversation from Job Details
  useEffect(() => {
    if (!requestedUser || !requestedJob) {
      return;
    }

    const matchingMessage = messages.find(
      (message) =>
        Number(message.job_id) === Number(requestedJob) &&
        (
          Number(message.sender_id) === Number(requestedUser) ||
          Number(message.receiver_id) === Number(requestedUser)
        )
    );

    // If messages already exist, use their information.
    if (matchingMessage) {
      openConversation(
        Number(requestedUser),
        Number(requestedJob),
        matchingMessage.job_title || "Job discussion",
        matchingMessage.company || "Company",
        matchingMessage.receiver_name ||
          matchingMessage.sender_name ||
          "User"
      );

      return;
    }

    // If there are NO previous messages, fetch job details
    // so a completely new conversation can still be started.
    const createNewConversation = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/${requestedJob}`
        );

        const job = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load job information.");
        }

        setSelectedConversation({
          userId: Number(requestedUser),
          jobId: Number(requestedJob),
          jobTitle: job.title,
          company: job.company,
          name: "Employer",
        });

        setConversation([]);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    createNewConversation();
  }, [messages, requestedUser, requestedJob]);

  // Send message
  const sendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim() || !selectedConversation) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver_id: selectedConversation.userId,
            job_id: selectedConversation.jobId,
            message: newMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send message"
        );
      }

      const sentMessage = data.data;

      setConversation((previous) => [
        ...previous,
        sentMessage,
      ]);

      // Add the new conversation to the message list
      setMessages((previous) => [
        sentMessage,
        ...previous,
      ]);

      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="messages-page">
        <div className="messages-container">

          {/* LEFT SIDE */}
          <aside className="conversation-sidebar">

            <div className="messages-title">
              <h1>Messages</h1>
              <p>Your job conversations</p>
            </div>

            {loading && (
              <p className="messages-status">
                Loading conversations...
              </p>
            )}

            {!loading && conversations.length === 0 && (
              <div className="no-conversations">
                <div className="empty-icon">💬</div>

                <h3>No conversations yet</h3>

                <p>
                  Start a conversation from a job's
                  details page.
                </p>
              </div>
            )}

            <div className="conversation-list">

              {conversations.map((item) => (
                <button
                  key={item.key}
                  className={`conversation-item ${
                    selectedConversation?.userId === item.userId &&
                    selectedConversation?.jobId === item.jobId
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    openConversation(
                      item.userId,
                      item.jobId,
                      item.jobTitle,
                      item.company,
                      item.name
                    )
                  }
                >
                  <div className="conversation-avatar">
                    {item.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div className="conversation-content">

                    <div className="conversation-top">
                      <strong>
                        {item.company}
                      </strong>

                      <small>
                        {item.sentAt
                          ? new Date(
                              item.sentAt
                            ).toLocaleDateString()
                          : ""}
                      </small>
                    </div>

                    <p className="conversation-job">
                      {item.jobTitle}
                    </p>

                    <p className="conversation-person">
                      With {item.name}
                    </p>

                    <p className="conversation-preview">
                      {item.lastMessage}
                    </p>

                  </div>
                </button>
              ))}

            </div>
          </aside>

          {/* RIGHT SIDE */}
          <section className="chat-window">

            {!selectedConversation && (
              <div className="empty-chat">

                <div className="large-chat-icon">
                  💬
                </div>

                <h2>Select a conversation</h2>

                <p>
                  Select a job conversation from the
                  left to view messages.
                </p>

              </div>
            )}

            {selectedConversation && (
              <>
                {/* CHAT HEADER */}
                <header className="chat-header">

                  <div className="chat-company-icon">
                    {selectedConversation.company
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>

                    <h2>
                      {selectedConversation.jobTitle}
                    </h2>

                    <p>
                      {selectedConversation.company}
                    </p>

                    <span>
                      Conversation with{" "}
                      <strong>
                        {selectedConversation.name}
                      </strong>
                    </span>

                  </div>

                </header>

                {/* MESSAGES */}
                <div className="chat-messages">

                  <div className="job-conversation-label">
                    <span>
                      Job:{" "}
                      {selectedConversation.jobTitle}
                    </span>

                    <span>
                      {selectedConversation.company}
                    </span>
                  </div>

                  {conversation.length === 0 && (
                    <div className="empty-conversation">
                      <p>
                        No messages yet.
                      </p>

                      <p>
                        Send a message to start the
                        conversation.
                      </p>
                    </div>
                  )}

                  {conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${
                        Number(message.sender_id) ===
                        Number(user.id)
                          ? "sent"
                          : "received"
                      }`}
                    >
                      <p>
                        {message.message}
                      </p>

                      <small>
                        {message.sent_at
                          ? new Date(
                              message.sent_at
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  ))}

                </div>

                {/* MESSAGE INPUT */}
                <form
                  className="message-form"
                  onSubmit={sendMessage}
                >

                  <input
                    type="text"
                    placeholder={`Message ${selectedConversation.name} about ${selectedConversation.jobTitle}...`}
                    value={newMessage}
                    onChange={(event) =>
                      setNewMessage(event.target.value)
                    }
                  />

                  <button
                    type="submit"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>

                </form>
              </>
            )}

          </section>
        </div>

        {error && (
          <div className="messages-error">
            {error}
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}

export default Messages;