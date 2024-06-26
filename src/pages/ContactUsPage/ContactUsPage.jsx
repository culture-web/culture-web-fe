import Button from '../../components/Common/Button';
import styles from './ContactUsPage.module.css';

function ContactUsPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };

  return (
    <div className={styles.contactUsPage}>
      <h1>Contact Us</h1>
      <p>Any questions? Drop us a message!</p>
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formRow}>
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
        </div>
        <div className={styles.formRow}>
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Phone Number" />
        </div>
        <textarea placeholder="Write your inquiry..." required />
        <Button onClick={handleSubmit}>Send Message</Button>
      </form>
    </div>
  );
}

export default ContactUsPage;
