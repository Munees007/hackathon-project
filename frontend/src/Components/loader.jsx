import normalLoading from "../assets/animations/normalLoading.json";
export const loadder = () =>{
    return(
        <div
            className={`w-full flex justify-center h-screen items-center bg-black`}
        >
            <Lottie animationData={normalLoading} loop={true} className="w-44" />
        </div>
    )
}