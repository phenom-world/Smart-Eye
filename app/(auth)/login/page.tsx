import LoginForm from '@/components/login';

export default async function Login() {
  return (
    <div className="relative h-screen flex items-center justify-center p-3">
      <LoginForm />
    </div>
  );
}
