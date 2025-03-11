import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 p-10 mt-10">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Categories */}
        <div>
          <h3 className="font-bold text-lg mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>Graphics & Design</li>
            <li>Digital Marketing</li>
            <li>Writing & Translation</li>
            <li>Video & Animation</li>
            <li>Music & Audio</li>
            <li>Programming & Tech</li>
            <li>AI Services</li>
            <li>Consulting</li>
          </ul>
        </div>

        {/* For Clients */}
        <div>
          <h3 className="font-bold text-lg mb-3">For Clients</h3>
          <ul className="space-y-2">
            <li>How Fiverr Works</li>
            <li>Customer Success Stories</li>
            <li>Trust & Safety</li>
            <li>Quality Guide</li>
            <li>Fiverr Learn</li>
            <li>Fiverr Guides</li>
          </ul>
        </div>

        {/* For Freelancers */}
        <div>
          <h3 className="font-bold text-lg mb-3">For Freelancers</h3>
          <ul className="space-y-2">
            <li>Become a Fiverr Freelancer</li>
            <li>Become an Agency</li>
            <li>Kickstart</li>
            <li>Community Hub</li>
            <li>Forum</li>
            <li>Events</li>
          </ul>
        </div>

        {/* Business Solutions */}
        <div>
          <h3 className="font-bold text-lg mb-3">Business Solutions</h3>
          <ul className="space-y-2">
            <li>Fiverr Pro</li>
            <li>Project Management Service</li>
            <li>ClearVoice</li>
            <li>Working Not Working</li>
            <li>AutoDS</li>
            <li>Fiverr Logo Maker</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold text-lg mb-3">Company</h3>
          <ul className="space-y-2">
            <li>About Fiverr</li>
            <li>Help & Support</li>
            <li>Social Impact</li>
            <li>Careers</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t pt-4">
        <p className="text-gray-300">© Fiverr International Ltd. 2025</p>
        <div className="flex space-x-4 text-gray-600">

        </div>
      </div>
    </footer>
  );
};

export default Footer;
