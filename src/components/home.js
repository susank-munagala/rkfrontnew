import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Slider from "react-slick";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useZoomOnScroll from "./useZoomOnScroll"; // adjust path as needed

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

const url_api = 'https://rkbackrailway-production.up.railway.app/';

export default function Home() {
  // State variables
  const [categories, setCategories] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerText, setOfferText] = useState("");
  const otherEvents = ["Space Theme", "Dinosaur Theme", "Avengers Theme", "Rainbow Theme", "Carnival Theme", "Jungle Theme", "Butterfly Theme",
    "Haldi Decorations", "Wedding Decorations", "Bride To Be", "Baby Shower", "Barbie Theme", "Spiderman Theme", "Boss Baby Theme"
  ];
  const icons = ["icons/1.png", "icons/2.png", "icons/3.png", "icons/4.png", "icons/5.png", "icons/6.png"];

  const aboutZoom = useZoomOnScroll();
  const galleryZoom = useZoomOnScroll();
  const testimonialsZoom = useZoomOnScroll();
  const contactZoom = useZoomOnScroll();

  // Testimonials data stored in a variable
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
      text: "The team at Balloons Brilliant made my daughter's birthday unforgettable. Thank you!",
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

  // Fetch offer text
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

  // Fetch categories
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
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

  // Slider settings
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
        {offerText && (
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              backgroundColor: '#dc2626', // red-600
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem', // text-sm
              padding: '0.5rem 1rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                paddingLeft: '100%',
                animation: 'marquee 15s linear infinite',
              }}
            >
              {offerText}
            </div>

            {/* Inline keyframes via a style tag */}
            <style>
              {`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}
            </style>
          </div>
        )}

        <!--div className="bg-white/80 backdrop-blur-md shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="flex items-center text-2xl font-extrabold tracking-wide text-indigo-700">
              <img
                src="/img/logo.png"  // <-- Replace with your actual logo path
                alt="Balloons Brilliant Events Logo"
                className="w-20 h-20 -m-6 mr-3 object-contain"
              />
              Balloons Brilliant Events
            </h1>
            <Link
              to="/admin"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm shadow-md transition-transform transform hover:scale-105"
            >
              Admin
            </Link>
          </div>
        </div-->
      </header>

      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-300 via-purple-300 to-transparent animate-pulse opacity-20 z-0"></div>
        <Slider {...settings} className="relative z-10 h-[85vh] w-full">
          {["bg-1.jpg", "bg-2.jpg", "bg-3.jpg"].map((image, idx) => (
            <div key={idx} className="relative h-[85vh] w-full">
              <img src={`/img/${image}`} alt={`slide-${idx}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
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

      <div className="relative z-50">
        <motion.svg
          viewBox="0 0 1440 75"
          className="w-full h-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 10, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#cb1152ff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2575fc', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="f1" x="0" y="0">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
              <feOffset dx="0" dy="5" result="offsetblur" />
              <feFlood floodColor="rgba(0, 0, 0, 0.5)" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path fill="url(#gradient1)" filter="url(#f1)" d="M0,30L30,40C60,50,120,70,180,50C240,30,300,10,360,10C420,10,480,30,540,30C600,30,660,10,720,10C780,10,840,30,900,40C960,50,1020,30,1080,20C1140,10,1200,10,1260,20C1320,30,1380,50,1410,60L1440,60L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0H0Z"></path>
        </motion.svg>
      </div>



      <FadeInSection delay={0.5}>
        <section ref={aboutZoom.ref} id="about" className="relative py-24 px-6 overflow-hidden">
          <motion.div style={{ scale: aboutZoom.scale }} className="absolute inset-0 z-0">
            <img src="/img/bg-4.jpg" className="w-full h-full object-cover blur-[2px]" alt="About" />
          </motion.div>
          <div className="relative z-10 max-w-4xl mx-auto text-center bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Balloons Brilliant & Flower Decorations has over a decade of experience in crafting unforgettable events. From themed birthdays to dreamy weddings, we blend creativity and precision to turn your vision into reality.
            </p>
          </div>
        </section>
      </FadeInSection>

      <div className="relative -mt-4 z-10">
        <motion.svg
          viewBox="0 0 1440 100"
          className="w-full h-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D66D75', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#E29587', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <polygon fill="url(#gradient2)" points="0,100 1440,0 1440,100" />
          <polygon fill="url(#gradient2)" points="0,100 720,50 0,0" />
          <polygon fill="url(#gradient2)" points="1440,100 720,50 1440,0" />
        </motion.svg>
      </div>

      <FadeInSection delay={0.5}>
        <section ref={galleryZoom.ref} id="gallery" className="relative py-24 px-6 overflow-hidden">
          <motion.div style={{ scale: galleryZoom.scale }} className="absolute inset-0 z-0">
            <img src="/img/bg-5.jpg" className="w-full h-full object-cover blur-[2px]" alt="Gallery" />
          </motion.div>
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
                        <img key={i} src={media} alt="preview" className="w-full h-60 object-cover transition-transform duration-500 hover:scale-105" />
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


      {/* Other Events Section */}
      <FadeInSection delay={0.7}>
        <section className="relative py-16 px-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 text-center mb-12">
              Other Events
            </h2>

            <div
              className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-6 
          gap-8
          px-4
        "
            >
              {otherEvents.map((title, idx) => {
                const iconSrc = icons[idx % icons.length];

                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="
                p-6 
                bg-white bg-opacity-90 
                rounded-2xl 
                border border-gray-200 
                flex flex-col items-center text-center
                shadow-md 
                hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] 
                hover:border-indigo-400
                hover:bg-white 
                hover:text-indigo-800 
                transition-all duration-300 ease-in-out
              "
                  >
                    <img
                      src={iconSrc}
                      alt={`${title} icon`}
                      className="w-16 h-16 mb-4 object-contain transition-transform duration-300 ease-in-out hover:rotate-6 hover:scale-125"
                      loading="lazy"
                    />
                    <h3 className="text-lg font-semibold text-gray-700 capitalize transition-colors duration-300">
                      {title}
                    </h3>
                  </motion.div>
                );
              })}
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

      <div className="relative z-10">
        <motion.svg
          viewBox="0 0 1440 100"
          className="w-full h-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 10, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#cb1152ff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2575fc', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="f1" x="0" y="0">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
              <feOffset dx="0" dy="5" result="offsetblur" />
              <feFlood floodColor="rgba(0, 0, 0, 0.5)" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path fill="url(#gradient1)" filter="url(#f1)" d="M0,30L30,40C60,50,120,70,180,50C240,30,300,10,360,10C420,10,480,30,540,30C600,30,660,10,720,10C780,10,840,30,900,40C960,50,1020,30,1080,20C1140,10,1200,10,1260,20C1320,30,1380,50,1410,60L1440,60L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0H0Z"></path>
        </motion.svg>
      </div>


      <FadeInSection delay={0.5}>
        {/* Testimonials Section */}
        <section ref={testimonialsZoom.ref} id="testimonials" className="relative py-24 px-6 overflow-hidden">
          <motion.div style={{ scale: testimonialsZoom.scale }} className="absolute inset-0 z-0">
            <img src="/img/bg-6.jpg" className="w-full h-full object-cover blur-[2px]" alt="Testimonials" />
          </motion.div>
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

      <div className="relative -mt-4 z-10">
        <motion.svg
          viewBox="0 0 1440 100"
          className="w-full h-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D66D75', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#E29587', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <polygon fill="url(#gradient2)" points="0,100 1440,0 1440,100" />
          <polygon fill="url(#gradient2)" points="0,100 720,50 0,0" />
          <polygon fill="url(#gradient2)" points="1440,100 720,50 1440,0" />
        </motion.svg>
      </div>

      <FadeInSection delay={0.5}>
        {/* Contact Section */}
        <section ref={contactZoom.ref} id="contact" className="relative py-24 px-6 overflow-hidden">
          <motion.div style={{ scale: contactZoom.scale }} className="absolute inset-0 z-0">
            <img src="/img/bg-7.jpg" className="w-full h-full object-cover blur-sm" alt="Contact" />
          </motion.div>
          <div className="relative z-10 max-w-3xl mx-auto bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Get In Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring -indigo-500 transition duration-300" />
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300" />
              </div>
              <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 h-32"></textarea>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-300">Send Message</button>
              {success && <p className="text-green-600 text-center">Message sent successfully!</p>}
              {loading && <p className="text-gray-600 text-center">Sending...</p>}
            </form>
          </div>
        </section>
      </FadeInSection>

      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 animate-pulse bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_10%,_transparent_11%)] bg-[length:20px_20px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <div>
            <h4 className="text-xl font-bold mb-4">Balloons Brilliant</h4>
            <p className="text-sm text-gray-300">Adding charm to your special days with elegance and joy.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#gallery" className="hover:underline">Gallery</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://instagram.com/your_instagram_username" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a></li>
              <li><a href="https://wa.me/919963054318" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-300">Phone: +91 9963054318</p>
            <p className="text-sm text-gray-300">Email:  balloonsbrilliant318@gmail.com</p>
          </div>
        </div>
        <hr className="my-6 border-gray-700 relative z-10" />
        <p className="text-center text-sm text-gray-400 relative z-10">© {new Date().getFullYear()} Balloons Brilliant & Decorations. All rights reserved.</p>
      </footer>

      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a href="https://wa.me/919963054318" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-xl transition-all transform hover:scale-110">
          <FaWhatsapp className="w-6 h-6" />
        </a>
        <a href="https://www.instagram.com/your_instagram_username" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white p-3 rounded-full shadow-xl transition-all transform hover:scale-110">
          <Instagram className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
