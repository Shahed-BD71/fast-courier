import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import swal from "sweetalert";
import HeroSection from "./heroSection";

export default function CourierForm() {
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [date, setDate] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    if (data) {
      swal({
        title: "Success!",
        text: "Booking Order Successfully!",
        icon: "success",
        button: "Done!",
      });
    } else {
      alert("Something is wrong");
    }
  };
  const fetchUsers = async () => {
    const res = await axios.get("/rules");
    return res.data;
  };

  const { data, status, error } = useQuery("rules", fetchUsers);

  useEffect(() => {
    let pricingRule;
    if (data) {
      const today = dayjs();
      let days = dayjs(data[0].date).diff(today, "d");
      for (let i = 0; i < data.length; i++) {
        const ruleDate = dayjs(data[i].date);
        const diff = ruleDate.diff(today, "d");
        if (diff !== 0) {
          if (diff < days) {
            days = diff;
            pricingRule = data[i];
          }
        }
      }
      setDiscount(pricingRule.discount);
      setDate(pricingRule.date);
    }
  }, [data]);

  useEffect(() => {
    const subscription = watch(({ weight, route }, data) => {
      if (parseInt(weight) >= 1 && route == "isd") {
        setPrice(50);
      }
      if (parseInt(weight) >= 2 && route == "isd") {
        setPrice(25 * weight);
      }
      if (parseInt(weight) >= 6 && route == "isd") {
        setPrice(15 * weight);
      }
      if (parseInt(weight) >= 1 && route == "osd") {
        setPrice(100);
      }
      if (parseInt(weight) >= 2 && route == "osd") {
        setPrice(50 * weight);
      }
      if (parseInt(weight) >= 6 && route == "osd") {
        setPrice(25 * weight);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <section>
      <div className="bg-gray-300">
        <div className="py-12">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex flex-row p-6 md:p-12">
              <h2 className="text-3xl font-semibold">Fast</h2>
              <h2 className="text-3xl font-semibold text-green-400">Courier</h2>
            </div>
            <div className="md:flex max-w-screen">
              <HeroSection />
              <div className="w-full p-4 md:px-16 px-8 py-8">
                <div className="flex flex-row py-5 text-xs">
                  <span className="text-sm md:text-xl lg:text-2xl font-semibold">
                    Fill Courier Information & Get
                    <span className="text-xl md:text-xl lg:text-2xl text-red-400">
                      {" "}
                      {discount && discount * 100}%
                    </span>{" "}
                    discount before{" "}
                    <span className="text-red-400 underline text-medium md:text-xl lg:text-2xl decoration-1">
                      {dayjs(date).format("DD MMMM")}
                    </span>
                  </span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid md:grid-cols-2 md:gap-2">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      {...register("firstName", {
                        required: true,
                        pattern: /^[a-z ,.'-]+$/i,
                      })}
                      className="input-field"
                      placeholder="First Name*"
                    />
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      {...register("lastName", {
                        required: true,
                        pattern: /^[a-z ,.'-]+$/i,
                      })}
                      className="input-field"
                      placeholder="Last Name*"
                    />
                  </div>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    {...register("company", { pattern: /^[a-z ,.'-]+$/i })}
                    className="input-field"
                    placeholder="Company (optional)"
                  />
                  <div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      {...register("address", {
                        required: true,
                        pattern: /^[a-zA-Z0-9\s,'-]*$/,
                      })}
                      className="input-field"
                      placeholder="Address*"
                    />
                    {errors.address && (
                      <span className="text-red-600">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 md:gap-2">
                    <div>
                      <select
                        name="route"
                        id="route"
                        {...register("route", { required: true })}
                        className="input-field"
                      >
                        {" "}
                        <option defaultChecked disabled>
                          Select Route
                        </option>
                        <option value={"isd"}>ISD - Inside Dhaka</option>
                        <option value={"osd"}>OSD - Outside Dhaka</option>
                      </select>
                      {errors.route && (
                        <span className="text-red-600">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        name="phone"
                        id="phone"
                        {...register("phone", {
                          required: true,
                          pattern: /^([0-9\(\)\/\+ \-]*)$/,
                        })}
                        className="input-field"
                        placeholder="Phone Number*"
                      />
                      {errors.phone && (
                        <span className="text-red-600">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 md:gap-2">
                    <div>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        {...register("weight", {
                          required: true,
                          min: 1,
                          max: 1000,
                        })}
                        className="input-field"
                        placeholder="Weight*"
                      />
                      {errors.weight && (
                        <span className="text-red-600">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div>
                      <select
                        className="input-field"
                        name="parcelType"
                        id="parcelType"
                        {...register("parcelType", {
                          required: true,
                        })}
                      >
                        <option defaultChecked disabled>
                          Parcel Type
                        </option>
                        <option value={"electronics"}>Electronics</option>
                        <option value={"cloths"}>Cloths</option>
                        <option value={"documents"}>Documents</option>
                      </select>
                      {errors.parcelType && (
                        <span className="text-red-600">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 space-y-2 text-right">
                    <p className="font-medium text-md">
                      Regular Price: {price} Tk
                    </p>
                    <p className="font-medium text-md">
                      Discount: {discount * 100} %
                    </p>
                    <hr />
                    <p className="text-lg font-semibold">
                      Total Price: {Math.round(price - price * discount)} Tk
                    </p>
                  </div>
                  <div className="flex justify-end pt-5">
                    <button
                      type="submit"
                      className="w-32 h-10 text-sm font-medium text-white bg-blue-500 rounded md:h-12 md:w-48"
                    >
                      Book Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
