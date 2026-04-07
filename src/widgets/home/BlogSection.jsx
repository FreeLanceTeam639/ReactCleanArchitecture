import { useI18n } from '../../shared/i18n/I18nProvider.jsx';

export default function BlogSection({ blogs }) {
  const { t } = useI18n();
  const featuredBlog = blogs?.[0];
  const otherBlogs = (blogs || []).slice(1);

  return (
    <section className="section wrap" id="articles">
      <div className="sectionHead splitHead blogHead">
        <div>
          <h2>{t('Insights, guides and practical freelance advice')}</h2>
          <p className="lead">{t('Explore fresh ideas, workflow improvements, and practical hiring insights from across the marketplace.')}</p>
        </div>
      </div>

      {featuredBlog ? (
        <article className="blogFeature cardLift">
          <div className="blogFeatureIcon">{featuredBlog.icon || '📰'}</div>
          <div>
            <div className="metaLine">
              <span>{featuredBlog.category}</span>
              <span>{featuredBlog.date}</span>
              <span>{featuredBlog.readTime || t('5 min read')}</span>
            </div>
            <h3>{featuredBlog.title}</h3>
            <p>{featuredBlog.summary}</p>
          </div>
        </article>
      ) : null}

      <div className="grid blogGrid">
        {otherBlogs.map((blog) => (
          <article key={blog.title} className="card blog cardLift">
            <div className="blogIcon">{blog.icon || '📰'}</div>
            <div className="metaLine">
              <span>{blog.category}</span>
              <span>{blog.date}</span>
              <span>{blog.readTime || t('4 min read')}</span>
            </div>
            <h3>{blog.title}</h3>
            <p>{blog.summary}</p>
          </article>
        ))}
      </div>
      <div className="center">
        <a href="#cta" className="btn soft interactive">
          {t('Explore more')}
        </a>
      </div>
    </section>
  );
}
