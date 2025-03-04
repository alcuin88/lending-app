"use client";

import { Mode } from "@/lib/constants";
import { redirect } from "next/navigation";

export default function LendingAppLanding() {
  function handleOnClick() {
    redirect(`/${Mode.login}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center p-10 bg-blue-600 text-white">
        <h1 className="text-4xl font-bold">
          Effortless Loan & Payment Tracking
        </h1>
        <p className="mt-4 text-lg">
          {`
          Manage your clients' loans, track payments, and stay organized—all in
          one place.`}
        </p>
        <button
          onClick={() => {
            handleOnClick();
          }}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="p-10 bg-white">
        <h2 className="text-3xl font-bold text-center">
          Why Choose Our Loan Management System?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Client Loan Tracking",
              desc: "Monitor all client loans in one dashboard.",
            },
            {
              title: "Automated Payment Reminders",
              desc: "Keep clients informed with timely notifications.",
            },
            {
              title: "Secure Data Management",
              desc: "Ensure all loan records are safely stored and accessible.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-100 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="p-10 bg-gray-200 text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          {[
            "Register & Add Clients",
            "Log Loan Details",
            "Track Payments & Dues",
            "Generate Reports",
          ].map((step, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg w-64">
              <span className="text-xl font-semibold">
                {index + 1}. {step}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-10 bg-white text-center">
        <h2 className="text-3xl font-bold">What Our Users Say</h2>
        <p className="mt-4 text-lg italic">{`This app has made tracking my clients' loans so easy! I never miss a payment update. - Dhafney A.`}</p>
      </section>

      {/* Call to Action */}
      <section className="p-10 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold">Start Managing Loans Efficiently</h2>
        <button
          onClick={() => {
            handleOnClick();
          }}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200"
        >
          Get Started Now
        </button>
      </section>
    </div>
  );
}
