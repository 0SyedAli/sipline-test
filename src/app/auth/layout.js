// "use client";
// import { useMemo } from "react";
// import "../../styles/auth.module.css";
// import styles from "../../styles/auth.module.css";
// import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
// import { usePathname } from "next/navigation";
// import { ToastContainer } from "react-toastify";

// export default function AuthLayout({ children }) {
//   const pathname = usePathname();

//   const content = {
//     login: {
//       title: "Login",
//       description: "Enter your account details to login",
//     },
//     forget: {
//       title: "Forgot password",
//       description: "Please enter your email to reset password",
//     },
//     otp: {
//       title: "OTP",
//       description:
//         "We have sent you an email containing 6 verification code. Please enter the code to verify your identity",
//     },
//     reset: {
//       title: "Reset Password",
//       description: "Please enter your new password to reset password",
//     },
//     createprofile: {
//       title: "Create Profile",
//       description: "Enter your details to register yourself",
//     },
//     locationdetails: {
//       title: "",
//       description: "",
//     },
//     createbussinessprofile: {
//       title: "Create A Business Profile",
//       description: "Enter your details to register yourself",
//     },
//     createbussinessprofile2: {
//       title: "Create A Business Profile",
//       description: "Enter your details to register yourself",
//     },
//     createbussinessprofile3: {
//       title: "Create A Business Profile",
//       description: "Enter your details to register yourself",
//     },
//     selectgender: {
//       title: "Select Gender",
//     },
//     addlocation: {
//       title: "Add Location",
//       description: "Enter your details to register yourself",
//     },
//   };

//   // Memoize the header based on the current pathname
//   const header = useMemo(() => {
//     const key = pathname.split("/").pop();
//     return content[key] || {};
//   }, [pathname]);

//   return (
//     <div className={styles.auth_container}>
//       <div className={styles.auth_image}></div>
//       <div className={styles.auth_form_container}>
//         <div className={styles.auth_form}>
//           <div className={styles.form_head}>
//             <h2>{header?.title}</h2>
//             <p>{header?.description}</p>
//           </div>
//           <ToastContainer />
//           {!header ? <SpinnerLoading /> : children}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useMemo, useState } from "react";
import "../../styles/auth.module.css";
import styles from "../../styles/auth.module.css";
import { usePathname } from "next/navigation";
import HeaderContext from "@/components/context/HeaderContext";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function AuthLayout({ children, success, headTitle }) {
  const pathname = usePathname();
  const router = useRouter();
  const content = {
    login: {
      title: "Login",
      description: "Enter your account details to login",
    },
    signup: {
      title: "Sign Up",
      description: "Enter your account details to Sign up",
    },
    forgot: {
      title: "Forgot password",
      description: "Please enter your email to reset password",
    },
    otp: {
      title: "OTP",
      description:
        "We have sent you an email containing a 6-digit verification code. Please enter the code to verify your identity",
    },
    otpverify: {
      title: "OTP",
      description:
        "We have sent you an email containing a 6-digit verification code. Please enter the code to verify your identity",
    },
    reset: {
      title: "Reset Password",
      description: "Please enter your new password to reset password",
    },
    createprofile: {
      title: "Create Profile",
      description: "Enter your details to register yourself",
    },
    locationdetails: {
      title: "",
      description: "",
    },
    createbussinessprofile: {
      title: "Create A Business Profile",
      description: "Enter your details to register yourself",
    },
    createbussinessprofile2: {
      title: "Create A Business Profile",
      description: "Enter your details to register yourself",
    },
    createbussinessprofile3: {
      title: "Create A Business Profile",
      description: "Enter your details to register yourself",
    },
    selectgender: {
      title: "Select Gender",
    },
    addlocation: {
      title: "Add Location",
      description: "Enter your details to register yourself",
    },
    locationdetails: {
      title: "Add Location Details",
      description: "Enter your details to register yourself",
    },
  };

  const [isLoaded, setIsLoaded] = useState(false);

  const header = useMemo(() => {
    const key = pathname.split("/").pop();
    return content[key] || {};
  }, [pathname]);

  // useLayoutEffect(() => {
  //   if (sessionStorage.getItem("token")) {
  //     // router.replace();
  //     if (sessionStorage?.getItem("step_after_login") === pathname) {
  //       setIsLoaded(true);
  //     }
  //   } else {
  //     setIsLoaded(true);
  //   }
  // }, [pathname]);
  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <HeaderContext.Provider value={header}>
        <div className={styles.auth_container}>
          <div className={styles.auth_image}></div>
          <div className={styles.auth_form_container}>
            <div className={styles.auth_form}>
              {/* {!isLoaded || success ? <SpinnerLoading /> : children} */}
              {children}
            </div>
          </div>
        </div>
      </HeaderContext.Provider>
    </>
  );
}
