import Lottie from "lottie-react";
import React, { useState } from "react";
import formAni from "../assets/animations/form.json";
import {  addRegistration } from "../Database/functions/addData";
import { Modal } from "antd";

export interface RegisterationData {
  college: string;
  className: string;
  email: string;
  mobile: string;
  timestamp?: object;
}
export interface Participants {
  Participant1: string;
  Participant2: string;
  RollNo1: string;
  RollNo2: string;
}

const Registration = () => {
  const [formData, setFormData] = useState<RegisterationData>({
    college: "",
    className: "",
    email: "",
    mobile: "",
  });
  const [ParticipantData, setParticipantData] = useState<Participants>({
    Participant1: "",
    Participant2: "",
    RollNo1: "",
    RollNo2: "",
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(() => {
    const temp = localStorage.getItem("formSubmitted");
    return temp ? Boolean(temp) : false;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "email" || e.target.name === "mobile"
          ? e.target.value
          : e.target.value.toUpperCase(),
    });
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipantData({
      ...ParticipantData,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const doSubmit = async () => {
    try {
      const newData = {
        ...formData,
        teamMembers:{...ParticipantData},
        paymentInfo:{
          amountPaid:"pending",
          paymentMode:"offline",
          paymentFrom:"",
          paymentTimestamp:0,
        }
        
      }
      await addRegistration(newData);
      setFormSubmitted(true);

      setFormData({
        college: "",
        className: "",
        email: "",
        mobile: "",
      });
      setParticipantData({
        Participant1: "",
        Participant2: "",
        RollNo1: "",
        RollNo2: "",
      });
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Modal.confirm({
      title: "Confirm Registration",
      content: (
        <div className="font-Orbiton">
          <p>Are you sure you want to register with the given details?</p>
          <p className="text-red-500 font-semibold">
            Note: Payment is non-refundable.
          </p>
        </div>
      ),
      okText: "Yes, Confirm",
      cancelText: "Cancel",
      onOk: doSubmit,
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4 sm:p-6 font-Orbiton">
      <form
        onSubmit={handleSubmit}
        className="bg-white relative w-full max-w-2xl p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200"
      >
        {/* Animation */}
        <Lottie
          animationData={formAni}
          loop
          className="w-20 sm:w-28 absolute -top-10 sm:-top-14 -left-6 sm:-left-10 -rotate-12"
        />

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl tracking-wide text-center font-extrabold mb-6 sm:mb-8 uppercase text-green-700">
          Registration
        </h2>

        {/* College Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            College Name
          </label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Participant I */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Participant I
            </label>
            <input
              type="text"
              name="Participant1"
              value={ParticipantData.Participant1}
              onChange={handleParticipantChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Roll No I */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Roll Number I
            </label>
            <input
              type="text"
              name="RollNo1"
              value={ParticipantData.RollNo1}
              onChange={handleParticipantChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Participant II */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Participant II
            </label>
            <input
              type="text"
              name="Participant2"
              value={ParticipantData.Participant2}
              onChange={handleParticipantChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Roll No II */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Roll Number II
            </label>
            <input
              type="text"
              name="RollNo2"
              value={ParticipantData.RollNo2}
              onChange={handleParticipantChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Class
            </label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Mobile */}
          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>
        </div>

        {/* QR Image */}
        <div className="text-center my-6 sm:my-8">
          <img
            src={""}
            alt="GPay QR"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg border-2 border-green-400 shadow-md"
          />
          <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-600">
            Please scan and pay before submitting.{" "}
            <span className="text-red-600 font-bold">No refunds.</span>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg transition-all ${
            formSubmitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white shadow-lg"
          }`}
        >
          {formSubmitted ? "Already Registered" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Registration;
