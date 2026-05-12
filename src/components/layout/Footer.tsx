// import { motion } from "framer-motion";
import { Mail, Heart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-card-bg border-t border-white/5 pt-8 pb-8 px-6 mt-8 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Logo & About */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-full" />
            <span className="text-2xl font-black tracking-tighter">
              FitFlow
            </span>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            مساحتكِ الآمنة للياقة البدنية، صُممت لتلائم أسلوب حياتكِ وتدعم
            أهدافكِ بكل حب.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-6">روابط سريعة</h4>
          <ul className="space-y-4 text-sm text-text-muted">
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              عن التطبيق
            </li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              التمارين
            </li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              التحديات
            </li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              المدونات
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold mb-6">الدعم</h4>
          <ul className="space-y-4 text-sm text-text-muted">
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              الأسئلة الشائعة
            </li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              اتصلي بنا
            </li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">
              سياسة الخصوصية
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold mb-6">اشتركي في نشرتنا</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="bg-main-bg border border-white/10 rounded-xl px-4 py-2 text-sm w-full focus:border-brand-primary outline-none transition-all"
            />
            <button className="bg-brand-primary p-2 rounded-xl hover:scale-105 transition-transform">
              <Mail size={20} />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="p-3 bg-white/5 rounded-full hover:text-brand-primary cursor-pointer transition-all">
              <FaInstagram size={20} />
            </div>
            <div className="p-3 bg-white/5 rounded-full hover:text-brand-primary cursor-pointer transition-all">
              <FaTwitter size={20} />
            </div>
            <div className="p-3 bg-white/5 rounded-full hover:text-brand-primary cursor-pointer transition-all">
              <FaFacebookF size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} FitFlow Fitness. جميع الحقوق محفوظة.
        </p>
        <p className="text-xs text-text-muted flex items-center gap-1">
          صنع بكل{" "}
          <Heart size={12} className="text-brand-primary fill-brand-primary" />{" "}
          لدعم قوتكِ
        </p>
      </div>
    </footer>
  );
};

export default Footer;
