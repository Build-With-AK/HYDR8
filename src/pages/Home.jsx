import React from 'react';
import Landing from '../components/Landing';
import Statics from '../components/Statics';
import ShopByCategory from '../components/ShopByCategory';
import WhyChooseUs from '../components/WhyChooseUs';
import FeaturedProducts from '../components/FeaturedProducts';
import CTABanner from '../components/CTABanner';
import FAQs from '../components/FAQs';

const Home = () => {
    return (
        <>
            <div className="fixed inset-0 z-[100] noise-overlay" />
            <div className="fixed inset-0 z-0" />
            <Landing />
            <Statics />
            <ShopByCategory />
            <WhyChooseUs />
            <FeaturedProducts />
            <CTABanner />
            <FAQs />
        </>
    );
};

export default Home;
