import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-scroll";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">ABOUT PICHUKA</h1>
              <p>Where culinary traditions meet modern excellence.</p>
            </div>
            <p className="mid">
            Welcome to Pichuka, a multi-cuisine restaurant that brings together the finest flavors from around the world. 
            Founded by Deekshitha Burugupalli, we believe that dining is not just about eating but experiencing a journey of flavors and traditions. 
            Our diverse menu celebrates global cuisines, featuring seasonal ingredients sourced from local farms and artisans, ensuring every dish is fresh, vibrant, and sustainably produced. 
            Our talented chefs blend contemporary techniques with authentic recipes, crafting each plate with passion and precision to deliver an unforgettable dining experience.
            </p>
            <Link to="menu" spy={true} smooth={true} duration={500}>
              Explore Menu{" "}
              <span>
                <HiOutlineArrowRight />
              </span>
            </Link>
          </div>
          <div className="banner">
            <img src="about.png" alt="about" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;