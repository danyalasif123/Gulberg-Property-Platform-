import Navbar from "../../components/public/Home/Navbar";
import Hero from "../../components/public/Home/Hero";
import FeaturedProperties from "../../components/public/Home/FeaturedProperties";
import ExploreCategories from "../../components/public/Home/ExploreCategories";
import WhyChooseUs from "../../components/public/Home/WhyChooseUs";
import Footer from "../../components/public/Home/Footer";

const Home = () => {
  return (
    <div className="public-site">

      <Navbar />

      <main>

        <Hero />

        <FeaturedProperties />
        <ExploreCategories />
      <WhyChooseUs />
       <Footer />
      </main>

    </div>
  );
};

export default Home;