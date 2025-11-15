import Lottie from "lottie-react";
import React, { useState } from "react";
import formAni from "../assets/animations/form.json";
import { addData } from "../Database/functions/addData";
import {  toast} from "react-toastify";

export interface FormData {
  lotNo:number;
  pass:string;
  timestamp?:object
}

const Form = ({Submitted}:{Submitted:(e:boolean) => void}) => {
  const [formData, setFormData] = useState<FormData>({
    lotNo:0,
    pass:""
  });

  const [formSubmitted,setFormSubmitted] = useState<boolean>(()=>{
    const temp = localStorage.getItem("formSubmitted");

    return temp ? Boolean(temp) : false;
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedData = {...formData}
      const res = await addData(updatedData);
      
      if(res.toastType == "success")
      {
        toast.success(res.toast)
      }
      if(res.toastType == "info")
      {
        toast.info(res.toast)
      }
      if(res.toastType == "error")
      {
        toast.error(res.toast)
      }
      
      if(res.status)
      {
        setFormSubmitted(true);
        localStorage.setItem("formSubmitted","true");
        localStorage.setItem("userData", JSON.stringify(updatedData));
        Submitted(true);
      }
      else
      {
        setFormSubmitted(false)
      }
      
      setFormData({
        lotNo:0,
        pass:""
      });
      
    } catch (error:any) {
      toast.error(error)
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
          Login
        </h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Lot Number
          </label>
          <input
            type="number"
            id="lotNo"
            name="lotNo"
            value={formData.lotNo}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-lg px-4 py-2 border-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="className"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="pass"
            name="pass"
            value={formData.pass}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-lg border-2 px-4 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-green-500 uppercase hover:bg-green-700 mt-2 text-black font-semibold px-4 py-2 rounded-lg ${formSubmitted ? "pointer-events-none bg-gray-600" : "pointer-events-auto"}`}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Form;
