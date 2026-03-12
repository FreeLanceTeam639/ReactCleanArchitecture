import { ROUTES } from '../../shared/constants/routes.js';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import { useLoginForm } from '../../features/auth/hooks/useLoginForm.js';

function LoginAlert({ message, type }) {
  if (!message) {
    return null;
  }

  return <div className={type === 'success' ? 'authAlert success' : 'authAlert error'}>{message}</div>;
}

export default function LoginPage({ navigate }) {
  const {
    form,
    showPassword,
    rememberMe,
    isSubmitting,
    feedback,
    setFieldValue,
    setShowPassword,
    setRememberMe,
    submitLogin
  } = useLoginForm(navigate);

  return (
    <div className="authShell">
      <div className="authBackdrop" />
      <div className="wrapLarge authGrid">
        <section className="authPanel fadeUp">
          <div className="authLogoMark" aria-hidden="true">
            <span />
            <span />
          </div>

          <a
            href={ROUTES.home}
            className="authBrand"
            onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
          >
            Workreap
          </a>

          <p className="authSubtitle">
            Please enter your email &amp; password to access your account
          </p>

          <LoginAlert message={feedback.message} type={feedback.type} />

          <form className="authForm" onSubmit={submitLogin}>
            <label className="authField">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setFieldValue('email', event.target.value)}
                placeholder="Please enter your email address"
                autoComplete="email"
                required
              />
            </label>

            <label className="authField">
              <span>Password</span>
              <div className="passwordWrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setFieldValue('password', event.target.value)}
                  placeholder="Please enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="passwordToggle interactive"
                  onClick={() => setShowPassword((currentState) => !currentState)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </label>

            <div className="authMetaRow">
              <label className="rememberRow">
                <input
                  className="checkboxInput"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button type="button" className="textButton interactive">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="authSubmit interactive" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="authSwitch">
            Don't have an account?{' '}
            <button
              type="button"
              className="inlineLink interactive"
              onClick={() => navigate(ROUTES.register)}
            >
              Sign up
            </button>
          </p>

          <div className="authHintBox">
            <p>
              <span>Email:</span> demo@workreap.com
            </p>
            <p>
              <span>Password:</span> google
            </p>
          </div>
        </section>

        <section className="authPreview fadeUp delayOne" aria-hidden="true">
          <div className="previewLaptop displayFloat">
            <div className="previewBezel">
              <div className="previewNotch" />
              <div className="previewScreen">
                <div className="previewCard">
                  <div className="previewBrand">
                    <span className="previewBrandMark" />
                    <b>Workreap</b>
                  </div>
                  <p>Please enter your email &amp; password to access your account</p>
                  <div className="previewInput" />
                  <div className="previewInput" />
                  <div className="previewSmallRow">
                    <span>Remember me</span>
                    <span>Forgot password?</span>
                  </div>
                  <button type="button" className="previewButton">
                    Sign In
                  </button>
                  <small>Don't have an account? Sign up</small>
                </div>
              </div>
            </div>
            <div className="previewBase" />
            <div className="floatingSupport">↻</div>
          </div>
        </section>
      </div>
    </div>
  );
}