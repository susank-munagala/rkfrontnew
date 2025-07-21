import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Slider from "react-slick";
import Modal from "react-modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

Modal.setAppElement("#root");

const FadeInSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

const url_api ='https://rkbackrailway-production.up.railway.app/';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerText, setOfferText] = useState("");

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${url_api}/get-offer`);
        setOfferText(res.data.latest_offer || "");
      } catch (error) {
        console.error("Failed to fetch offer:", error);
      }
    };
    fetchOffer();
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "Absolutely loved the decor! It was even better than I imagined. Highly recommended!",
      image: "",
    },
    {
      name: "Rahul Mehta",
      text: "Very professional and creative team. They made our wedding truly magical.",
      image: "",
    },
    {
      name: "Anita Verma",
      text: "The team at RK Balloons made my daughter's birthday unforgettable. Thank you!",
      image: null,
    },
    {
      name: "Vikram Reddy",
      text: "Great service and attention to detail. Highly recommended for any celebration.",
      image: "",
    },
    {
      name: "Sunita Patel",
      text: "Wonderful balloon decorations and smooth coordination.",
      image: "",
    },
    {
      name: "Arjun Singh",
      text: "The decorations were stunning and the team was very professional. Highly recommend!",
      image: "",
    },
    {
      name: "Neha Kapoor",
      text: "They transformed our event into a dream. Thank you for the amazing work!",
      image: "",
    },
    {
      name: "Karan Malhotra",
      text: "The attention to detail was impeccable. Our guests were amazed!",
      image: null,
    },
    {
      name: "Meera Desai",
      text: "Fantastic service and beautiful decorations. Will definitely hire them again!",
      image: "",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${url_api}/media-list`);
        const data = res.data;
        const grouped = data.reduce((acc, item) => {
          const cat = item.category;
          const url = `${url_api}${item.url}`;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(url);
          return acc;
        }, {});
        const formatted = Object.keys(grouped).map((cat) => ({ title: cat, images: grouped[cat] }));
        setCategories(formatted);
      } catch (err) {
        console.error("Error fetching media list", err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const formId = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdXibg963QMRoctFOJZ3VAqxeBEXxMS6Zn0NmD_dxw5KZae2g/formResponse";
    const formDataGoogle = new FormData();
    formDataGoogle.append("entry.2043925985", formData.name);
    formDataGoogle.append("entry.1900205694", formData.email);
    formDataGoogle.append("entry.313245533", formData.message);
    formDataGoogle.append("entry.684456586", formData.phone);
    try {
      await fetch(formId, {
        method: "POST",
        mode: "no-cors",
        body: formDataGoogle,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "", phone: "" });
    } catch (error) {
      console.error("Submission failed", error);
    }
    setLoading(false);
  };

  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    fade: true,
    arrows: false,
  }), []);

  return (
    <div className="bg-gradient-to-br from-white via-slate-100 to-slate-200 text-gray-800 min-h-screen font-sans">
      {/* Animated Offer Banner */}
      <header className="w-full fixed top-0 left-0 z-50">
        {/* Offer Banner */}
        {offerText && (
          <div className="w-full bg-red-600 text-white text-sm font-semibold py-2 px-4 text-center whitespace-nowrap overflow-hidden animate-marquee">
            {offerText}
          </div>
        )}

        {/* Main Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-extrabold tracking-wide text-indigo-700">RK Balloons</h1>
            <Link to="/admin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm shadow-md">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-300 via-purple-300 to-transparent animate-pulse opacity-20 z-0"></div>
        <Slider {...settings} className="relative z-10 h-[85vh] w-full">
          {["bg-1.jpg", "bg-2.jpg", "bg-3.jpg"].map((image, idx) => (
            <div key={idx} className="relative h-[85vh] w-full">
              <img src={`/img/${image}`} alt={`slide-${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-black drop-shadow-md">We Decorate Your Dreams</motion.h2>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg mt-4">Stunning decor for birthdays, weddings, parties and more.</motion.p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <FadeInSection delay={0.1}>
        <section id="about" className="relative py-24 px-6 overflow-hidden">
          {/* Background Image with Zoom on Scroll */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ scale: useTransform(useScroll().scrollY, [0, 500], [1, 1.1]) }} // Adjust the scale as needed
          >
            <img
              src="/img/about-bg.jpg"
              alt="About Background"
              className="w-full h-full object-cover blur-sm"
            />
          </motion.div>

          {/* Foreground Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              RK Balloons & Flower Decorations has over a decade of experience in crafting unforgettable events. From themed birthdays to dreamy weddings, we blend creativity and precision to turn your vision into reality.
            </p>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section id="gallery" className="relative py-24 px-6 overflow-hidden">
          {/* Background Image with Zoom on Scroll */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ scale: useTransform(useScroll().scrollY, [0, 500], [1, 1.1]) }} // Adjust the scale as needed
          >
            <img
              src="/img/gallery-bg.jpg"
              alt="Gallery Background"
              className="w-full h-full object-cover blur-sm"
            />
          </motion.div>

          {/* Foreground Content */}
          <div className="relative z-10 max-w-7xl mx-auto bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-12">Our Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.03 }} className="rounded-2xl shadow-xl overflow-hidden border border-gray-200 bg-white cursor-pointer" onClick={() => { setSelectedCategory(cat); setPreviewIndex(0); setIsModalOpen(true); }}>
                  <Slider {...settings}>
                    {cat.images.map((media, i) =>
                      /\.(mp4|webm|ogg)$/i.test(media) ? (
                        <video key={i} src={media} muted controls className="w-full h-60 object-cover" />
                      ) : (
                        <img key={i} src={media} alt="preview" className="w-full h-60 object-cover" />
                      )
                    )}
                  </Slider>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Category Gallery"
          style={{
            content: {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90vw",
              height: "90vh",
              padding: 0,
              overflow: "hidden",
              borderRadius: "12px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
            },
            overlay: {
              zIndex: 50,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
          }}
        >
          <div className="bg-white h-full flex flex-col p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">{selectedCategory?.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white font-bold text-lg rounded-full p-2 hover:bg-red-600 transition"
              >
                ✖
              </button>
            </div>
            <div className="flex flex-1 gap-4 overflow-hidden">
              <div className="w-4/5 h-full rounded-lg flex items-center justify-center overflow-hidden">
                {selectedCategory && selectedCategory.images.length > 0 && (
                  /\.(mp4|webm|ogg)$/i.test(selectedCategory.images[previewIndex]) ? (
                    <video
                      key={previewIndex}
                      src={selectedCategory.images[previewIndex]}
                      controls
                      muted
                      autoPlay={false}
                      preload="metadata"
                      className="max-h-full max-w-full object-contain rounded-lg shadow"
                    />
                  ) : (
                    <img
                      key={previewIndex}
                      src={selectedCategory.images[previewIndex]}
                      loading="lazy"
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow"
                    />
                  )
                )}
              </div>
              <div className="w-1/5 overflow-y-auto pr-1">
                <div className="flex flex-col gap-3">
                  {selectedCategory?.images.slice(0, 50).map((media, i) => {
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(media);
                    return (
                      <div
                        key={i}
                        onClick={() => setPreviewIndex(i)}
                        className={`border-2 rounded-lg cursor-pointer overflow-hidden transition-transform transform hover:scale-105 ${i === previewIndex ? "border-blue-500" : "border-gray-300"}`}
                      >
                        {isVideo ? (
                          <video
                            src={media}
                            muted
                            controls={false}
                            preload="metadata"
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={media}
                            loading="lazy"
                            alt={`Thumb ${i}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <FadeInSection>
        {/* Testimonials Section */}
        <section id="testimonials" className="relative py-24 px-6 overflow-hidden">
          {/* Background Image with Zoom on Scroll */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ scale: useTransform(useScroll().scrollY, [0, 500], [1, 1.1]) }} // Adjust the scale as needed
          >
            <img
              src="/img/testimonials-bg.jpg"
              alt="Testimonials Background"
              className="w-full h-full object-cover blur-sm"
            />
          </motion.div>

          {/* Foreground Content */}
          <div className="relative z-10 max-w-6xl mx-auto text-center bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-indigo-700 mb-12">What Our Clients Say</h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="px-2"
              >
                {testimonials.map((testimonial, idx) => (
                  <SwiperSlide key={idx}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 h-full flex flex-col mb-8"
                    >
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-indigo-500 text-white font-bold text-xl">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                      <p className="text-gray-600 italic mb-4 flex-grow">“{testimonial.text}”</p>
                      <h4 className="text-indigo-700 font-semibold">{testimonial.name}</h4>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        {/* Contact Section */}
        <section id="contact" className="relative py-24 px-6 overflow-hidden">
          {/* Background Image with Zoom on Scroll */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ scale: useTransform(useScroll().scrollY, [0, 500], [1, 1.1]) }} // Adjust the scale as needed
          >
            <img
              src="/img/contact-bg.jpg"
              alt="Contact Background"
              className="w-full h-full object-cover blur-sm"
            />
          </motion.div>

          {/* Foreground Content */}
          <div className="relative z-10 max-w-3xl mx-auto bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Get In Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"></textarea>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">Send Message</button>
              {success && <p className="text-green-600 text-center">Message sent successfully!</p>}
              {loading && <p className="text-gray-600 text-center">Sending...</p>}
            </form>
          </div>
        </section>
      </FadeInSection>

      <footer className="py-6 bg-white shadow-md">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} RK Balloons. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}