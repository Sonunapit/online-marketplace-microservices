import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar
from "../../../components/navbar/Navbar";

import {
  getCurrentUser,
} from "../../auth/services/auth.service";

const ProfilePage = () => {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    fetchUser();

  }, []);

  const fetchUser =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        // No Token
        if (!token) {

          navigate("/login");

          return;

        }

        const response =
          await getCurrentUser(
            token
          );

        setUser(
          response.data.user
        );

      } catch (error) {

        console.log(error);

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

      } finally {

        setLoading(false);

      }

    };

  // Logout
  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate("/login");

      window.location.reload();

    };

  // Loading
  if (loading) {

    return (

      <div className="h-screen flex items-center justify-center text-4xl font-bold">

        Loading...

      </div>

    );

  }

  return (

    <div className="bg-gray-100 min-h-screen pb-24">

      <Navbar />

      <div className="max-w-5xl mx-auto py-16 px-5">

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">

          {/* Top */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* Avatar */}
            <div className="h-28 w-28 rounded-full bg-black flex items-center justify-center text-white text-4xl font-bold">

              {
                user?.fullName
                  ?.firstName?.charAt(0)
              }

            </div>

            {/* Info */}
            <div>

              <h1 className="text-3xl md:text-4xl font-bold">

                {
                  user?.fullName
                    ?.firstName
                }{" "}

                {
                  user?.fullName
                    ?.lastName
                }

              </h1>

              <p className="text-gray-500 text-lg mt-2">

                {user?.email}

              </p>

              <span className="inline-block mt-3 bg-black text-white px-4 py-2 rounded-xl capitalize">

                {user?.role}

              </span>

              {/* Seller Buttons */}
              {
                user?.role ===
                "seller" && (

                  <div className="mt-6 flex flex-wrap gap-4">

                    <a
                      href="/seller/products"
                      className="bg-black text-white px-5 py-3 rounded-2xl"
                    >

                      Seller Products

                    </a>

                    <a
                      href="/seller/create-product"
                      className="border px-5 py-3 rounded-2xl"
                    >

                      Create Product

                    </a>

                  </div>

                )
              }

            </div>

          </div>

          {/* Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">

            {/* Account */}
            <div className="bg-gray-100 p-6 rounded-2xl">

              <h2 className="text-2xl font-bold mb-4">

                Account Details

              </h2>

              <p className="mb-3">

                <strong>
                  Username:
                </strong>{" "}

                {user?.username}

              </p>

              <p className="mb-3">

                <strong>
                  Email:
                </strong>{" "}

                {user?.email}

              </p>

              <p>

                <strong>
                  Role:
                </strong>{" "}

                {user?.role}

              </p>

            </div>

            {/* Addresses */}
            <div className="bg-gray-100 p-6 rounded-2xl">

              <h2 className="text-2xl font-bold mb-4">

                Addresses

              </h2>

              {
                user?.addresses
                  ?.length > 0 ? (

                  user.addresses.map(
                    (address) => (

                      <div
                        key={address._id}
                        className="border bg-white p-4 rounded-xl mb-4"
                      >

                        <p>

                          {
                            address.street
                          }

                        </p>

                        <p>

                          {
                            address.city
                          },
                          {" "}
                          {
                            address.state
                          }

                        </p>

                        <p>

                          {
                            address.country
                          }
                          {" "}
                          -
                          {" "}
                          {
                            address.pincode
                          }

                        </p>

                        {
                          address.default && (

                            <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm">

                              Default

                            </span>

                          )
                        }

                      </div>

                    )
                  )

                ) : (

                  <p>

                    No Addresses Found

                  </p>

                )
              }

            </div>

          </div>

          {/* Logout */}
          <div className="mt-10">

            <button
              onClick={
                handleLogout
              }
              className="bg-red-500 text-white px-6 py-3 rounded-2xl"
            >

              Logout

            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProfilePage;