import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSection({
  testimonials,
  activeTestimonial,
  activeIndex,
  onDotClick,
  onPrevious,
  onNext
}) {
  return (
    <section className="section wrap testimonial cardLift">
      <div className="testImage">
        <div className="avatarMini" />
        <div className="portrait">💬</div>
      </div>
      <div className="testContent">
        <div className="testimonialTopBar">
          <div>
            <h2>We Love Our Client Feedback</h2>
            <span className="role">{activeTestimonial?.metric}</span>
          </div>
          <div className="testimonialControls">
            <button type="button" className="testimonialArrow interactive" onClick={onPrevious} aria-label="Previous testimonial">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="testimonialArrow interactive" onClick={onNext} aria-label="Next testimonial">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="quoteMark">❝</div>
        <p>{activeTestimonial?.quote}</p>
        <p className="muted">{activeTestimonial?.quote2}</p>
        <strong>{activeTestimonial?.name}</strong>
        <span className="role">{activeTestimonial?.role}</span>

        <div className="testimonialDots">
          {(testimonials || []).map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              className={index === activeIndex ? 'testimonialDot active interactive' : 'testimonialDot interactive'}
              onClick={() => onDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
