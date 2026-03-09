export default function TestimonialSection({ testimonial }) {
  return (
    <section className="section wrap testimonial cardLift">
      <div className="testImage">
        <div className="avatarMini" />
        <div className="portrait">📸</div>
      </div>
      <div className="testContent">
        <h2>We Love Our Client Feedback</h2>
        <div className="quoteMark">❝</div>
        <p>{testimonial?.quote}</p>
        <p className="muted">{testimonial?.quote2}</p>
        <strong>{testimonial?.name}</strong>
        <span className="role">{testimonial?.role}</span>
      </div>
    </section>
  );
}
