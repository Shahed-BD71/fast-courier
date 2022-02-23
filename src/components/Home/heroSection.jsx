import React from "react";
import heroImage from "../../assets/images/Illustration.svg";

const HeroSection = () => {
  return (
    <section className="container flex justify-center items-center">
      <div className="m-8 xl-mb-6">
        <img className="object-cover" src={heroImage} alt="" />
      </div>
    </section>
  )
}

export default HeroSection;
