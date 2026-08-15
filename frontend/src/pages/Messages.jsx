import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/messages.css";

function Messages() {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) {
        setError("Please login to use messages.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/messages/contacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load contacts");
        }

        const data = await response.json();
        setContacts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token]);

  const openConversation = async (contact) => {
    setSelectedUser(contact);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/conversation/${contact.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load conversation");
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load conversation.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedUser) {
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
            receiver_id: selectedUser.id,
            message: newMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setMessages((previous) => [
        ...previous,
        {
          ...data.data,
          sender_name: user.name,
          receiver_name: selectedUser.name,
        },
      ]);

      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  if (!token) {
    return (
      <>
        <Navbar />

        <main className="messages-page">
          <div className="messages-empty">
            <h2>Please login first</h2>
            <p>You need an account to use messaging.</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="messages-page">
        <div className="messages-container">

          <aside className="contacts-panel">
            <div className="messages-title">
              <h1>Messages</h1>
              <p>Connect with employers and candidates.</p>
            </div>

            {loading && (
              <p className="messages-status">
                Loading contacts...
              </p>
            )}

            {!loading && contacts.length === 0 && (
              <div className="no-contacts">
                <p>No conversations yet.</p>
                <span>
                  Start a conversation from a job.
                </span>
              </div>
            )}

            <div className="contacts-list">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`contact-item ${
                    selectedUser?.id === contact.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => openConversation(contact)}
                >
                  <div className="contact-avatar">
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{contact.name}</strong>
                    <span>{contact.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="conversation-panel">

            {!selectedUser ? (
              <div className="conversation-empty">
                <h2>Select a conversation</h2>
                <p>
                  Choose someone from the left to start messaging.
                </p>
              </div>
            ) : (
              <>
                <div className="conversation-header">
                  <div className="contact-avatar">
                    {selectedUser.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2>{selectedUser.name}</h2>
                    <p>{selectedUser.role}</p>
                  </div>
                </div>

                <div className="messages-list">
                  {messages.length === 0 && (
                    <div className="no-messages">
                      <p>No messages yet.</p>
                      <span>Send the first message.</span>
                    </div>
                  )}

                  {messages.map((message) => {
                    const isMine =
                      Number(message.sender_id) ===
                      Number(user.id);

                    return (
                      <div
                        key={message.id}
                        className={`message-row ${
                          isMine ? "mine" : "theirs"
                        }`}
                      >
                        <div className="message-bubble">
                          <p>{message.message}</p>

                          <span>
                            {new Date(
                              message.sent_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  className="message-form"
                  onSubmit={handleSend}
                >
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={newMessage}
                    onChange={(e) =>
                      setNewMessage(e.target.value)
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

            {error && (
              <p className="messages-error">
                {error}
              </p>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Messages;