import { ArrowLeft, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes.js';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import { useForgotPasswordForm } from '../../features/auth/hooks/useForgotPasswordForm.js';
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.jsx';
import BrandLogo from '../../shared/ui/BrandLogo.jsx';

function ForgotPasswordAlert({ message, type }) {
  if (!message) {
    return null;
  }

  return <div className={type === 'success' ? 'authAlert success' : 'authAlert error'}>{message}</div>;
}

export default function ForgotPasswordPage({ navigate }) {
  const {
    form,
    activeStep,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    isResending,
    feedback,
    sentToEmail,
    setFieldValue,
    setShowPassword,
    setShowConfirmPassword,
    submitEmailStep,
    submitResetStep,
    resendCode,
    goToRequestStep,
    goToLogin
  } = useForgotPasswordForm(navigate);

  const isResetStep = activeStep === 'reset';

  return (
    <div className="authShell">
      <div className="authBackdrop" />
      <div className="wrapLarge authGrid">
        <section className="authPanel fadeUp">
          <div className="authPanelTopBar">
            <LanguageSwitcher className="authLanguageSwitcher" />
          </div>

          <button type="button" className="authBackLink interactive" onClick={goToLogin}>
            <ArrowLeft size={16} />
            <span>Back to sign in</span>
          </button>

          <BrandLogo
            href={ROUTES.home}
            className="brand authBrand"
            onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
          />

          <p className="authSubtitle">
            {isResetStep
              ? 'Enter the code from your email and set a new password for your account.'
              : 'We will send a verification code to your email so you can safely reset your password.'}
          </p>

          <div className="authStepRow" aria-label="Forgot password steps">
            <div className={isResetStep ? 'authStep' : 'authStep active'}>
              <span>01</span>
              <strong>Send code</strong>
            </div>
            <div className={isResetStep ? 'authStep active' : 'authStep'}>
              <span>02</span>
              <strong>Reset password</strong>
            </div>
          </div>

          <ForgotPasswordAlert message={feedback.message} type={feedback.type} />

          {!isResetStep ? (
            <form className="authForm" onSubmit={submitEmailStep}>
              <label className="authField">
                <span>Email address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setFieldValue('email', event.target.value)}
                  placeholder="Please enter your email"
                  autoComplete="email"
                  required
                />
              </label>

              <div className="authHintBox">
                <p>
                  Enter your email address to receive a verification code and continue the password reset securely.
                </p>
              </div>

              <button type="submit" className="authSubmit interactive" disabled={isSubmitting}>
                {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form className="authForm" onSubmit={submitResetStep}>
              <div className="authInfoCard">
                <div className="authInfoIcon">
                  <Mail size={18} />
                </div>
                <div>
                  <strong>Code destination</strong>
                  <p>{sentToEmail || form.email}</p>
                </div>
              </div>

              <label className="authField">
                <span>Verification code</span>
                <input
                  type="text"
                  value={form.code}
                  onChange={(event) => setFieldValue('code', event.target.value)}
                  placeholder="Enter the code from your email"
                  autoComplete="one-time-code"
                  required
                />
              </label>

              <div className="forgotPasswordGrid">
                <label className="authField">
                  <span>New password</span>
                  <div className="passwordWrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(event) => setFieldValue('password', event.target.value)}
                      placeholder="Please enter new password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="passwordToggle interactive"
                      onClick={() => setShowPassword((currentState) => !currentState)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="authField">
                  <span>Confirm password</span>
                  <div className="passwordWrap">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(event) => setFieldValue('confirmPassword', event.target.value)}
                      placeholder="Retype new password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="passwordToggle interactive"
                      onClick={() => setShowConfirmPassword((currentState) => !currentState)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
              </div>

              <div className="authButtonRow">
                <button type="button" className="authSecondaryButton interactive" onClick={goToRequestStep}>
                  Change email
                </button>
                <button
                  type="button"
                  className="textButton interactive"
                  disabled={isResending}
                  onClick={resendCode}
                >
                  {isResending ? 'Resending...' : 'Resend code'}
                </button>
              </div>

              <button type="submit" className="authSubmit interactive" disabled={isSubmitting}>
                {isSubmitting ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          <p className="authSwitch">
            Remembered your password?{' '}
            <button type="button" className="inlineLink interactive" onClick={goToLogin}>
              Sign In
            </button>
          </p>
        </section>

        <section className="authPreview fadeUp delayOne" aria-hidden="true">
          <div className="previewLaptop displayFloat">
            <div className="previewBezel">
              <div className="previewNotch" />
              <div className="previewScreen">
                <div className="previewCard">
                  <BrandLogo as="div" className="brand previewBrand" />

                  <div className="forgotPreviewBadge">
                    <ShieldCheck size={18} />
                    <span>Secure recovery flow</span>
                  </div>

                  <p>
                    {isResetStep
                      ? 'Use the verification code from email and replace the old password in one flow.'
                      : 'Send a recovery request and receive the verification code in your email.'}
                  </p>

                  <div className="forgotPreviewSteps">
                    <div className={isResetStep ? 'forgotPreviewStep' : 'forgotPreviewStep active'}>
                      <Mail size={16} />
                      <span>Email code request</span>
                    </div>
                    <div className={isResetStep ? 'forgotPreviewStep active' : 'forgotPreviewStep'}>
                      <KeyRound size={16} />
                      <span>Reset with code</span>
                    </div>
                  </div>

                  <div className="previewInput" />
                  <div className="previewInput" />
                  <button type="button" className="previewButton">
                    {isResetStep ? 'Save New Password' : 'Send Verification Code'}
                  </button>
                  <small>{sentToEmail || 'Verification code will arrive to the selected email address.'}</small>
                </div>
              </div>
            </div>
            <div className="previewBase" />
            <div className="floatingSupport">OK</div>
          </div>
        </section>
      </div>
    </div>
  );
}
