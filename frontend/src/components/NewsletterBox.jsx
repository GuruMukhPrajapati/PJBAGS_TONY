import React from 'react';

const NewsletterWithMap = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container mx-auto px-4">
      {/* Newsletter Section */}
      <div className="text-center mb-12">
        <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% off</p>
        <p className="text-gray-400 mt-3">
        Carry Style, Carry Quality – Your Perfect Bag Awaits!
        </p>
        <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
          <input
            className="w-full sm:flex-1 outline-none"
            type="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="bg-black text-white text-xs px-10 py-4">
            SUBSCRIBE
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="w-full h-96 bg-gray-100 relative">
        <iframe
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.5927439353693!2d75.78799877601495!3d22.646224628920144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fc5c5e21f851%3A0xc68a21c54f8d619f!2sApna%20Sweets%20-%20Bangali%20Square!5e0!3m2!1sen!2sin!4v1708929121997!5m2!1sen!2sin"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default NewsletterWithMap;