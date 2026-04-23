interface Props { password: string; }

const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[a-z]/.test(pwd))         score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/\d/.test(pwd))            score++;
  if (/[@$!%*?&]/.test(pwd))     score++;
  return score;
};

const labels   = ['', 'Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
const colors   = ['', '#e63946', '#f77f00', '#fcbf49', '#52b788', '#2d6a4f'];

export const PasswordStrength = ({ password }: Props) => {
  if (!password) return null;
  const score = getStrength(password);

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ backgroundColor: i <= score ? colors[score] : '#dee2e6' }}
          />
        ))}
      </div>
      <span style={{ color: colors[score], fontSize: '0.8rem' }}>
        {labels[score]}
      </span>
      {score < 5 && (
        <ul className="strength-hints">
          {password.length < 8          && <li>Mínimo 8 caracteres</li>}
          {!/[a-z]/.test(password)      && <li>Al menos una minúscula</li>}
          {!/[A-Z]/.test(password)      && <li>Al menos una mayúscula</li>}
          {!/\d/.test(password)         && <li>Al menos un número</li>}
          {!/[@$!%*?&]/.test(password)  && <li>Al menos un carácter especial (@$!%*?&)</li>}
        </ul>
      )}
    </div>
  );
};