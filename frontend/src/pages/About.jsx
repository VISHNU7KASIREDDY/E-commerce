import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-12">
        {}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6">
            About SpiceRoute
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Bringing authentic Indian flavors to your doorstep with traditional recipes passed down through generations.
          </p>
        </div>

        {}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              SpiceRoute was born from a passion for preserving and sharing the rich culinary heritage of India. Our
              journey began in a small kitchen where traditional recipes were crafted with love and care.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Today, we continue that tradition, bringing you authentic pickles, podis, spices, and snacks made using
              time-honored methods and the finest ingredients.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Every product tells a story of tradition, quality, and the authentic taste of India.
            </p>
          </div>
          <div className="bg-neutral-200 dark:bg-neutral-800 rounded-xl h-96 flex items-center justify-center">
            <span className="material-symbols-outlined text-neutral-400 text-[120px]">restaurant</span>
          </div>
        </div>

        {}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-[32px]">verified</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Authenticity</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Traditional recipes and methods preserved for generations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-[32px]">eco</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Quality</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Only the finest ingredients, sourced with care
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-[32px]">favorite</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Passion</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Made with love and dedication to authentic flavors
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="bg-gradient-to-r from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/20 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Experience Authentic Indian Flavors
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Explore our collection of handcrafted pickles, podis, spices, and snacks
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-orange-600 transition-colors text-white text-base font-bold tracking-[0.015em] shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
