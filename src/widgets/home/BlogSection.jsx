export default function BlogSection({ blogs }) {
  return (
    <section className="section wrap" id="articles">
      <h2>Insights and perspectives, exploring the boundless horizons</h2>
      <p className="lead">Explore diverse topics to gain fresh ideas and expert opinions.</p>
      <div className="grid blogGrid">
        {blogs.map((blog) => (
          <article key={blog.title} className="card blog cardLift">
            <div className="blogIcon">{blog.icon || '📰'}</div>
            <div className="metaLine">
              <span>{blog.category}</span>
              <span>{blog.date}</span>
            </div>
            <h3>{blog.title}</h3>
            <p>{blog.summary}</p>
          </article>
        ))}
      </div>
      <div className="center">
        <a href="#cta" className="btn soft interactive">
          Explore More
        </a>
      </div>
    </section>
  );
}
