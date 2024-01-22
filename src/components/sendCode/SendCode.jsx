import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { verifyToken } from "../../actions/user";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import logoImg from "../../assets/Hefson_logo.svg";

const baseURL = process.env.REACT_APP_BASEURL;

function SendCode() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  const [otp, setOtp] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: "",
  });

  const dispatch = useDispatch();
  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      console.log("next");

      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const OTP = otp.otp1 + otp.otp2 + otp.otp3 + otp.otp4 + otp.otp5 + otp.otp6;
    // setLoading(true);

    if (
      otp.otp1 === "" ||
      otp.otp2 === "" ||
      otp.otp3 === "" ||
      otp.otp4 === "" ||
      otp.otp5 === "" ||
      otp.otp6 === ""
    ) {
      toast("Please fill correct and complete verification code");
    } else {
      dispatch(verifyToken({ otp: OTP }));
    }
    // setLoading(false);
  };

  // if (loading == false) {
  //   setLoading(true);
  //   navigate("/login");
  // }

  const resendCode = async (e) => {
    e.preventDefault();

    async function resendEmailToken() {
      const userEmail = Cookies.get("userEmail")
        ? JSON.parse(Cookies.get("userEmail"))
        : "";
      // console.log("userEmail => ", userEmail);
      const { data } = await axios.put(`${baseURL}/user/resend-email-token`, {
        email: userEmail,
      });
      toast(data.message);
    }
    resendEmailToken();
  };

  return (
    <div className="auth">
      <div className="container customContainer">
        <div className="row h-100">
          <div className="col-12 text-center">
            <Link to="https://hefson.com/">
              <img className="logo" src={logoImg} alt="logo" />
            </Link>
          </div>

          <div className="col-12">
            <div className="content m-auto">
              <h2>Enter Code</h2>
              <p className="note">
                Verification Code Sent on{" "}
                {Cookies.get("userEmail") ? (
                  JSON.parse(Cookies.get("userEmail"))
                ) : (
                  <strong>email not found, Please try again later!</strong>
                )}
              </p>
              <form action="" onSubmit={submitHandler}>
                <div className="row">
                  <div className="col-12 enterOTP">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        value={otp.otp1}
                        onChange={(e) =>
                          setOtp({
                            ...otp,
                            otp1: e.target.value,
                          })
                        }
                        tabIndex="1"
                        maxLength="1"
                        onKeyUp={(e) => inputfocus(e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          const otpArray = pastedText.split("");
                          setOtp({
                            otp1: otpArray[0] || "",
                            otp2: otpArray[1] || "",
                            otp3: otpArray[2] || "",
                            otp4: otpArray[3] || "",
                            otp5: otpArray[4] || "",
                            otp6: otpArray[5] || "",
                          });
                        }}
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        value={otp.otp2}
                        onChange={(e) =>
                          setOtp({
                            ...otp,
                            otp2: e.target.value,
                          })
                        }
                        tabIndex="2"
                        maxLength="1"
                        onKeyUp={(e) => inputfocus(e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          const otpArray = pastedText.split("");
                          setOtp({
                            otp1: otpArray[0] || "",
                            otp2: otpArray[1] || "",
                            otp3: otpArray[2] || "",
                            otp4: otpArray[3] || "",
                            otp5: otpArray[4] || "",
                            otp6: otpArray[5] || "",
                          });
                        }}
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        value={otp.otp3}
                        onChange={(e) =>
                          setOtp({
                            ...otp,
                            otp3: e.target.value,
                          })
                        }
                        tabIndex="3"
                        maxLength="1"
                        onKeyUp={(e) => inputfocus(e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          const otpArray = pastedText.split("");
                          setOtp({
                            otp1: otpArray[0] || "",
                            otp2: otpArray[1] || "",
                            otp3: otpArray[2] || "",
                            otp4: otpArray[3] || "",
                            otp5: otpArray[4] || "",
                            otp6: otpArray[5] || "",
                          });
                        }}
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        value={otp.otp4}
                        onChange={(e) =>
                          setOtp({
                            ...otp,
                            otp4: e.target.value,
                          })
                        }
                        tabIndex="4"
                        maxLength="1"
                        onKeyUp={(e) => inputfocus(e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          const otpArray = pastedText.split("");
                          setOtp({
                            otp1: otpArray[0] || "",
                            otp2: otpArray[1] || "",
                            otp3: otpArray[2] || "",
                            otp4: otpArray[3] || "",
                            otp5: otpArray[4] || "",
                            otp6: otpArray[5] || "",
                          });
                        }}
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        value={otp.otp5}
                        onChange={(e) =>
                          setOtp({
                            ...otp,
                            otp5: e.target.value,
                          })
                        }
                        tabIndex="5"
                        maxLength="1"
                        onKeyUp={(e) => inputfocus(e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          const otpArray = pastedText.split("");
                          setOtp({
                            otp1: otpArray[0] || "",
                            otp2: otpArray[1] || "",
                            otp3: otpArray[2] || "",
                            otp4: otpArray[3] || "",
                            otp5: otpArray[4] || "",
                            otp6: otpArray[5] || "",
                          });
                        }}
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        value={otp.otp6}
                        onChange={(e) =>
                          setOtp({
                            ...otp,
                            otp6: e.target.value,
                          })
                        }
                        tabIndex="6"
                        maxLength="1"
                        onKeyUp={(e) => inputfocus(e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          const otpArray = pastedText.split("");
                          setOtp({
                            otp1: otpArray[0] || "",
                            otp2: otpArray[1] || "",
                            otp3: otpArray[2] || "",
                            otp4: otpArray[3] || "",
                            otp5: otpArray[4] || "",
                            otp6: otpArray[5] || "",
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <button className="btn btn-main w-100">VERIFY</button>
                  </div>
                </div>
              </form>
              <p className=" mt-4 mb-0">
                Did not receive code?{" "}
                <Link href="/login" onClick={resendCode}>
                  Resend Code
                </Link>
              </p>
              <p className=" mt-4 mb-0">
                <Link className="d-flex" to="/login">
                  <img src="./assets/icons/leftArrow.svg" alt="" /> Back to log
                  in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendCode;
