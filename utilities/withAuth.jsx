import { useRouter } from "next/navigation";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const token = sessionStorage.getItem("token");

  if (!token || tokenExpired(token)) {
    router.push("/auth/login");
  }

  return children;
};

const withAuth = (WrappedComponent) => {
  const Wrapped = () => {
    return (
      <AuthWrapper>
        <WrappedComponent />
      </AuthWrapper>
    );
  };

  return Wrapped;
};

export default withAuth;