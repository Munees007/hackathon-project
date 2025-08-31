import Lottie from "lottie-react";
import React, { useState } from "react";
import formAni from "../assets/animations/form.json";
import { addData } from "../Database/functions/addData";
import {  ToastContainer } from "react-toastify";

export interface FormData {
  name: string;
  rollNumber: string;
  className: string;
  email: string;
  timestamp?:object
}
export interface Participants
{
  p1: string,
  p2: string,
  rn1:string,
  rn2:string
}

const Form = ({Submitted}:{Submitted:(e:boolean) => void}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    rollNumber: "",
    className: "",
    email: "",
  });
  const [ParticipantData,setParticipantData] = useState<Participants>({
    p1:"",
    p2:"",
    rn1:"",
    rn2:""
  })
  const [formSubmitted,setFormSubmitted] = useState<boolean>(()=>{
    const temp = localStorage.getItem("formSubmitted");

    return temp ? Boolean(temp) : false;
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.name === "email" ? e.target.value : e.target.value.toUpperCase() });
  };

  const handleParticipantChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setParticipantData({...ParticipantData,[e.target.name]:e.target.value.toUpperCase()})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const pName = `${ParticipantData.p1}  & ${ParticipantData.p2}`;
      const pRollNo = `${ParticipantData.rn1} & ${ParticipantData.rn2}`
      const updatedData = {...formData,name:pName,rollNumber:pRollNo}
      await addData(updatedData);
      
      
      setFormSubmitted(true);
      localStorage.setItem("formSubmitted","true");
      localStorage.setItem("userData", JSON.stringify(updatedData));
      setFormData({
        name: "",
        rollNumber: "",
        className: "",
        email: "",
      });
      setParticipantData({
        p1:"",
        p2:"",
        rn1:"",
        rn2:""
      })
      Submitted(true);
      
    } catch (error) {
      console.error("Failed to submit form data:", error);
      Submitted(false);
      
    }
  };

  return (
    <div className="">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col font-Orbiton tracking-widest relative w-[40rem] p-8 rounded-lg shadow-lg"
      >
        <Lottie animationData={formAni} loop className="w-32 absolute -top-12 -left-10 -rotate-12 "/>
        <h2 className="text-2xl tracking-widest text-center font-semibold mb-4 uppercase font-Orbiton ">
          Registeration
        </h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Participant I
          </label>
          <input
            type="text"
            id="p1"
            name="p1"
            value={ParticipantData.p1}
            onChange={handleParticipantChange}
            className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="rollNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            Roll Number I
          </label>
          <input
            type="text"
            id="rn1"
            name="rn1"
            value={ParticipantData.rn1}
            onChange={handleParticipantChange}
            className="block w-full border-gray-300 rounded-lg border-2 px-4 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Participant II
          </label>
          <input
            type="text"
            id="p2"
            name="p2"
            value={ParticipantData.p2}
            onChange={handleParticipantChange}
            className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2"
            required
          />
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="rollNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            Roll Number II 
          </label>
          <input
            type="text"
            id="rn2"
            name="rn2"
            value={ParticipantData.rn2}
            onChange={handleParticipantChange}
            className="block w-full border-gray-300 rounded-lg border-2 px-4 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="className"
            className="block text-gray-700 font-bold mb-2"
          >
            Class
          </label>
          <input
            type="text"
            id="className"
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-lg border-2 px-4 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-lg border-2 px-4 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-green-500 uppercase hover:bg-green-700 mt-2 text-black font-semibold px-4 py-2 rounded-lg ${formSubmitted ? "pointer-events-none bg-gray-600" : "pointer-events-auto"}`}
        >
          Submit
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default Form;
