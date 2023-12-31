import Image from "next/image";
import { Palanquin } from "next/font/google";
import { Slide } from "react-slideshow-image";
import { FaQuoteRight } from "react-icons/fa6";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlineClose, AiOutlineMinus } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { FiPlayCircle, FiActivity } from "react-icons/fi";
import Link from "next/link";
import moment from "moment";
import ReactAudioPlayer from "react-audio-player";

import "moment/locale/id";
import "react-slideshow-image/dist/styles.css";

const font = Palanquin({
  subsets: ["latin"],
  weight: ["400"]
});

interface CProps {
	data: any;
  subject?: string;
}

const chunk = 9;

export default function TheWeddingBody({data, subject}: CProps) {
  const [transition1, setTransition1] = useState<boolean>(false);
  const [transition2, setTransition2] = useState<boolean>(false);

  const [hscroll, setHscroll] = useState<number>(0);
  const [day, setDay] = useState<string>("00");
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [second, setSecond] = useState<string>("00");
  const [slideFirst, setSlideFirst] = useState<any[]>([]);
  const [slideLast, setSlideLast] = useState<any[]>([]);
  const [galleryTop, setGalleryTop] = useState<any[]>([]);
  const [galleryBot, setGalleryBot] = useState<any[]>([]);
  const [greetings, setGreetings] = useState<any[]>([]);
  const [pauseBackSound, setPauseBackSound] = useState<boolean>(false);
  const backSound = useRef<any>(null);

  const [pronouncer, setPronouncer] = useState<string>(subject ?? "");
  const [relation, setRelation] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");

  const sendGreetings = async () => {
    try {
      const http = await fetch("/api/greeting", {
        method: "POST",
        body: JSON.stringify({
          undangan_id: data.id,
          pronouncer: pronouncer,
          relation: relation,
          greeting: greeting
        })
      });

      if (http.status == 200) {
        const response = await http.json();
        setGreetings((prevState: any) => [response.data, ...prevState]);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const toggleBackSound = () => {
    if (!pauseBackSound) {
      setPauseBackSound(true);
      return backSound.current.audioEl.current.pause();
    } else {
      setPauseBackSound(false);
      return backSound.current.audioEl.current.play();
    }
  }

  const scrollVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setHscroll(scrolled);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener('scroll', scrollVisible);
    }
  }, []);

  useEffect(() => {
    console.log(hscroll);
    if (hscroll == 0 && !transition1) {
      setTransition1(true);
    }
    if (hscroll > 90 && !transition2) {
      setTransition2(true);
    }
  }, [hscroll]);

  useEffect(() => {
    const countdownWedding = setInterval(() => {
      const endDate = moment(data.akad_date).valueOf();
      const dateNow = new Date().getTime();
      const timeLeft = endDate - dateNow;

      if (endDate > dateNow) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setDay(days < 10 ? "0" + days.toString() : days.toString());
        setHour(hours < 10 ? "0" + hours.toString() : hours.toString());
        setMinute(minutes < 10 ? "0" + minutes.toString() : minutes.toString());
        setSecond(seconds < 10 ? "0" + seconds.toString() : seconds.toString());
      } else {
        setDay("00");
        setHour("00");
        setMinute("00");
        setSecond("00");
      }
    }, 1000);

    setGreetings(data.greetings.length > 0 ? data.greetings.sort((a: any, b: any) => b.id - a.id) : data.greetings);
    setGalleryTop(data.photos.slice(0, chunk));
    setGalleryBot(data.photos.slice(chunk, chunk + data.photos.length));
    setSlideFirst(data.photos.filter((sla: any) => sla.prefix == "slide1"));
    setSlideLast(data.photos.filter((sla: any) => sla.prefix == "slide2"));

    return () => {
      clearInterval(countdownWedding);
    }
  }, [useState]);

  return (
    <main className={`max-w-[420px] ${font.className}`}>
      <div className="h-screen">
        <div className="flex items-start">
          <div className="flex-1 w-full relative overflow-hidden">
            <div className={`h-[460px] relative trans-left-prepered ${transition1 ? "trans-left" : ""}`}>
              <Slide arrows={false} duration={1000} indicators={false} transitionDuration={4000} autoplay={slideFirst.length > 0 ? true : false} infinite={true} canSwipe={false}>
                {slideFirst.map((d: any, i: number) => {
                  return (
                    <div className="each-slide-effect" key={i}>
                      <div className="h-[460px]" style={{backgroundImage: `url(https://undangan.loofytech.com/${d.photo})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                        <span></span>
                      </div>
                    </div>
                  )
                })}
              </Slide>
              <div className="absolute z-10 bottom-0 w-full py-3" style={{backgroundImage: "linear-gradient(transparent, rgba(0, 0, 0, 0.4))"}}>
                <h1 className="text-white text-center font-bold font-bodoni text-5xl">Wedding</h1>
              </div>
            </div>
            <div className="bg-cyan py-[10px]">
              <h3 className="text-center text-white tracking-[4px] font-bold uppercase text-sm">{data.female_nickname} & {data.male_nickname}</h3>
            </div>
          </div>
          <div className="w-[20%] h-[460px] relative">
            <div
              className={`rotate-90 whitespace-nowrap absolute left-[-50px] text-cyan uppercase text-xs tracking-[5px] trans-top-prepered ${transition1 ? "trans-top-70" : ""}`}
            >
              The Wedding
            </div>
            <div className={`absolute bottom-[-45px] left-1 font-bodoni text-cyan z-30 font-bold text-3xl trans-opacity-prepered ${transition1 ? "trans-opacity" : ""}`}>
              {moment(data.resepsi_date).format("MMM")}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-[65%] mt-6">
            <div className={`border-b-2 border-cyan relative trans-left-prepered ${transition1 ? "trans-left" : ""}`}>
              <div className="absolute scale-x-[-1] opacity-10 top-2 left-2"><FaQuoteRight size={60} color="#95A682" /></div>
            </div>
            <div className={`relative text-cyan top-[36px] left-3 italic text-sm leading-4 trans-opacity-prepered ${transition1 ? "trans-opacity" : ""}`}>
              Love is when imperfection being perfection.
            </div>
          </div>
          <div className={`overflow-hidden flex-1 flex flex-col text-cyan font-bodoni font-bold mt-2 pr-3`}>
            <div className={`text-6xl relative trans-right-prepered ${transition1 ? "trans-right" : ""}`}>{moment(data.resepsi_date).format("DD")}</div>
            <div className={`mt-1 text-3xl flex relative justify-end trans-right-prepered ${transition1 ? "trans-right" : ""}`}>{moment(data.resepsi_date).format("YYYY")}</div>
          </div>
        </div>
      </div>
      {/* Countdown */}
      <div className="py-[5em] px-[1.5em] bg-cyan overflow-hidden">
        <div className={`flex items-center gap-4 relative trans-left-prepered ${transition2 ? "trans-left" : ""}`}>
          <div className="border-b border-white w-[48px]"></div>
          <div className="text-white font-bodoni italic text-2xl">
            QS Ar-rum 21
          </div>
        </div>
        <div className={`italic text-white text-sm mt-8 trans-opacity-prepered ${transition2 ? "trans-opacity" : ""}`}>
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
        </div>
        <div className={`flex items-center justify-around border-t border-b border-white py-5 mt-16 relative trans-right-prepered ${transition2 ? "trans-right" : ""}`}>
          <div className="flex flex-col items-center font-bodoni text-white">
            <span className="text-2xl">{day}</span>
            <span className="text-sm">Hari</span>
          </div>
          <div className="flex flex-col items-center font-bodoni text-white">
            <span className="text-2xl">{hour}</span>
            <span className="text-sm">Jam</span>
          </div>
          <div className="flex flex-col items-center font-bodoni text-white">
            <span className="text-2xl">{minute}</span>
            <span className="text-sm">Menit</span>
          </div>
          <div className="flex flex-col items-center font-bodoni text-white">
            <span className="text-2xl">{second}</span>
            <span className="text-sm">Detik</span>
          </div>
        </div>
      </div>
      {/* Mempelai Wanita */}
      <div className="pt-[5em]">
        <div className="flex">
          <div className="flex-1 relative">
            <div className="absolute rotate-[270deg] uppercase text-xs text-cyan tracking-[4px] top-[130px] right-[-30px]">The Bride</div>
          </div>
          <div
            className="w-[60%] h-[300px] relative overflow-hidden"
            style={{
              backgroundImage: `url(https://undangan.loofytech.com/${data.photos.filter((photo: any) => photo.prefix == "mempelai-wanita")[0].photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute flex items-center left-0 top-0 justify-center w-16 h-16 bg-cyan text-white font-bodoni text-2xl font-bold">
              {data.female_nickname.slice(0, 1)}
            </div>
          </div>
        </div>
        <div className="p-[32px]">
          <div className="font-bodoni text-cyan text-right text-2xl pb-3">{data.female_name}</div>
          <div className="text-sm font-bold text-[#757575] text-right">Putri {data.female_children_to} Dari</div>
          <div className="text-sm text-[#757575] text-right">Bapak {data.female_father_name} dan Ibu {data.female_mother_name}</div>
          <div className="mt-10 flex justify-end">
            <Link href={data.female_ig} className="flex items-center font-bold text-xs text-cyan uppercase tracking-[3px]" target="_blank">
              Instagram
              <BsArrowRight size={12} className="mt-0.5 ml-1"  />
            </Link>
          </div>
        </div>
      </div>
      {/* Mempelai Pria */}
      <div className="pt-[2em]">
        <div className="flex">
          <div
            className="w-[60%] h-[300px] relative overflow-hidden"
            style={{
              backgroundImage: `url(https://undangan.loofytech.com/${data.photos.filter((photo: any) => photo.prefix == "mempelai-pria")[0].photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute flex items-center right-0 top-0 justify-center w-16 h-16 bg-cyan text-white font-bodoni text-2xl font-bold">
              {data.male_nickname.slice(0, 1)}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute rotate-[90deg] uppercase text-xs text-cyan tracking-[4px] top-[130px] left-[-35px]">The Groom</div>
          </div>
        </div>
        <div className="p-[32px]">
          <div className="font-bodoni text-cyan text-left text-2xl pb-3">{data.male_name}</div>
          <div className="text-sm font-bold text-[#757575] text-left">Putra {data.male_children_to} Dari</div>
          <div className="text-sm text-[#757575] text-left">Bapak {data.male_father_name} dan Ibu {data.male_mother_name}</div>
          <div className="mt-10 flex justify-start">
            <Link href={data.male_ig} className="flex items-center font-bold text-xs text-cyan uppercase tracking-[3px]" target="_blank">
              Instagram
              <BsArrowRight size={12} className="mt-0.5 ml-1"  />
            </Link>
          </div>
        </div>
      </div>
      {/* Akad & Resepsi */}
      <div className="mt-[2em] bg-cyan p-[1.5em]">
        <div className="w-[120px] mx-auto h-1 rounded-full bg-white mb-14"></div>
        <div className="relative">
          <div className="overflow-hidden">
            <Image src={`https://undangan.loofytech.com/${data.photos.filter((photo: any) => photo.prefix == "akad")[0].photo}`} width={327} height={280} alt="" />
          </div>
          <div className="relative flex items-end top-[-70px]">
            <div className="flex-1 pr-4">
              <div className="text-right text-white text-3xl font-bodoni">{moment(data.akad_date).format("DD")}</div>
              <div className="text-right text-white text-3xl font-bodoni my-4">{moment(data.akad_date).format("MM")}</div>
              <div className="text-right text-white text-3xl font-bodoni">{moment(data.akad_date).format("YY")}</div>
            </div>
            <div className="w-[80%] bg-white py-[2em] px-[1em]">
              <h2 className="text-2xl text-cyan uppercase text-right font-[500] tracking-[2px]">Akad Nikah</h2>
              <div className="mt-5 text-sm text-[#757575] font-semibold text-right">{moment(data.akad_date).format("dddd, DD MMMM YYYY")}</div>
              <div className="mb-4 text-sm text-[#757575] font-semibold text-right">Pukul {moment(data.akad_date).format("hh:mm")} WIB</div>
              <div className="text-xs tracking-[1px] text-cyan text-right leading-4">{data.akad_place}</div>
              <div className="mt-8 flex justify-end">
                <Link href={`https://maps.google.com/maps/place/${data.akad_place}`} className="flex items-center font-bold text-xs text-cyan uppercase" target="_blank">
                  <span>Google Maps</span>
                  <BsArrowRight size={12} className="mt-0.5 ml-2"  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <Image src={`https://undangan.loofytech.com/${data.photos.filter((photo: any) => photo.prefix == "resepsi")[0].photo}`} width={327} height={280} alt="" />
          </div>
          <div className="relative flex items-end top-[-70px]">
            <div className="w-[80%] bg-white py-[2em] px-[1em]">
              <h2 className="text-2xl text-cyan uppercase text-left font-[500] tracking-[2px]">Resepsi</h2>
              <div className="mt-5 text-sm text-[#757575] font-semibold text-left">{moment(data.resepsi_date).format("dddd, DD MMMM YYYY")}</div>
              <div className="mb-4 text-sm text-[#757575] font-semibold text-left">Pukul {moment(data.resepsi_date).format("hh:mm")} WIB</div>
              <div className="text-xs tracking-[1px] text-cyan text-left leading-4">{data.resepsi_place}</div>
              <div className="mt-8 flex justify-start">
                <Link href={`https://maps.google.com/maps/place/${data.resepsi_place}`} className="flex items-center font-bold text-xs text-cyan uppercase" target="_blank">
                  <span>Google Maps</span>
                  <BsArrowRight size={12} className="mt-0.5 ml-2"  />
                </Link>
              </div>
            </div>
            <div className="flex-1 pl-4">
              <div className="text-left text-white text-3xl font-bodoni">{moment(data.resepsi_date).format("DD")}</div>
              <div className="text-left text-white text-3xl font-bodoni my-4">{moment(data.resepsi_date).format("MM")}</div>
              <div className="text-left text-white text-3xl font-bodoni">{moment(data.resepsi_date).format("YY")}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Love Story */}
      <div className="mt-[4em] px-[1em]">
        <div className="relative">
          <div className="relative top-0 w-[80%] h-[250px]" style={{backgroundImage: `url(https://undangan.loofytech.com/${data.photos.filter((photo: any) => photo.prefix == "love-story")[0].photo})`, backgroundSize: "cover"}}></div>
          <div className="absolute bottom-[-160px] right-0 w-[55%] h-[230px] border-[9px] border-r-0 border-white" style={{backgroundImage: `url(https://undangan.loofytech.com/${data.photos.filter((photo: any) => photo.prefix == "love-story")[1].photo})`, backgroundSize: "cover"}}></div>
        </div>
        <div className="relative mt-10">
          <div className="font-bodoni leading-10 italic text-6xl text-cyan">
            Love
            <br />
            Story
          </div>
          <div className="px-[2em] mt-24">
            <div className="mt-10">
              <h2 className="text-cyan uppercase tracking-[2px] text-xl font-semibold">Pertemuan</h2>
              <p className="italic text-[#757575] text-[13px] mt-3">Tidak ada kebetulan di dunia ini, semua sudah tersusun rapih oleh sang maha pencipta, kita tidak bisa memilih kepada siapa kita akan jatuh cinta. Singkat cerita kita bertemu di tahun 2022, awal mula kita saling berkirim pesan melalui instagram, lalu tak lama setelahnya memutuskan untuk bertemu, dipertemuan itulah kami saling bicara lebih dalam tentang satu sama lain.</p>
            </div>
            <div className="mt-10">
              <h2 className="text-cyan uppercase tracking-[2px] text-right text-xl font-semibold">Pendekatan</h2>
              <p className="italic text-[#757575] text-[13px] text-right mt-3">Katanya cinta dapat tumbuh dengan kebersamaan, seiring berjalannya waktu kami semakin dekat, seiring berjalannya waktu akhirnya kita memutuskan untuk berpacaran dan serius untuk menjalani hubungan.</p>
            </div>
            <div className="mt-10">
              <h2 className="text-cyan uppercase tracking-[2px] text-xl font-semibold">Lamaran</h2>
              <p className="italic text-[#757575] text-[13px] mt-3">Kehandak-Nya menuntun kami pada sebuah pertemuan yang tak pernah di sangka hingga akhirnya membawa kami pada sebuah ikatan suci yang dicintai-Nya, kami melangsungkan acara lamaran di bulan Oktober 2023 lalu.</p>
            </div>
            <div className="mt-10">
              <h2 className="text-cyan uppercase tracking-[2px] text-right text-xl font-semibold">Menikah</h2>
              <p className="italic text-[#757575] text-[13px] text-right mt-3">Percayalah, bukan karna bertemu lalu berjodoh tapi karna berjodoh lah maka kami dipertemukan, kami memutuskan untuk mengikrarkan janji suci pernikahan kami di bulan Januari ini insya allah Sebagai mana yang pernah dikatakan oleh saydina Ali bin abi thalib : " Apa yang menjadi takdirmu akan menemukan jalannya untuk menemukanmu."</p>
            </div>
          </div>
        </div>
      </div>
      {/* Gallery & Gift */}
      <div className="mt-[5em] bg-cyan p-[1em]">
        <div className="bg-white px-[1.5em] py-[5em]">
          <h2 className="text-3xl font-bodoni italic text-cyan text-center mb-10">Our Gallery</h2>
          <div className="relative h-[140px]">
            <Slide
              arrows={false}
              duration={1000}
              indicators={false}
              transitionDuration={4000}
              autoplay={true}
              infinite={true}
              canSwipe={false}
              slidesToScroll={1}
              slidesToShow={2}
            >
              {galleryTop.map((d: any, i: number) => {
                return (
                  <div className="each-slide-effect" key={i}>
                    <div className="h-[140px]" style={{backgroundImage: `url(https://undangan.loofytech.com/${d.photo})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                        <span></span>
                    </div>
                  </div>
                )
              })}
            </Slide>
          </div>
          <div className="relative h-[140px] rotate-180">
            <Slide
              arrows={false}
              duration={1000}
              indicators={false}
              transitionDuration={4000}
              autoplay={true}
              infinite={true}
              canSwipe={false}
              slidesToScroll={1}
              slidesToShow={2}
            >
              {galleryBot.map((d: any, i: number) => {
                return (
                  <div className="each-slide-effect rotate-180" key={i}>
                    <div className="h-[140px]" style={{backgroundImage: `url(https://undangan.loofytech.com/${d.photo})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                        <span></span>
                    </div>
                  </div>
                )
              })}
            </Slide>
          </div>
        </div>
        <div className="py-[4em] px-[2em]">
          <h2 className="text-3xl font-bodoni italic text-white text-center">Wedding Gift</h2>
          <p className="text-white text-[13px] leading-4 text-center mt-4">Mungkin karna jarak, waktu, ataupun keadaan yang menghalangi untuk ikut hadir dalam acara pernikahan kami, silahkan klik tombol dibawah untuk mengirimkan hadiah secara cashless</p>
          <div className="flex items-center justify-center mt-14 mb-10">
            <input id="gift" type="checkbox" className="drawer-toggle" />
            <label htmlFor="gift" className="cursor-pointer border-y-2 py-[12px] px-[24px] uppercase tracking-[2px] flex items-center text-white text-xs font-bold gap-2">
              Klik Disini
              <div className="mt-1">
                <BsArrowRight />
              </div>
            </label>
            <div className="drawer-side">
              <label htmlFor="gift" className="drawer-overlay"></label>
              <div className="menu p-4 w-80 min-h-full text-cyan bg-white">
                <div className="flex items-center gap-5">
                  <label htmlFor="gift">
                    <AiOutlineClose size={24} />
                  </label>
                  <span className="text-lg font-bodoni italic">Gift & Hadiah</span>
                </div>
                <div className="text-center mt-16 mb-10">
                  Bagi bapak/ibu/saudara/i yang ingin mengirimkan hadiah pernikahan dapat melalui virtual account atau e-wallet di bawah ini:
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                  {data.gifts.map((gift: any, iter: number) => {
                    return (
                      <div key={iter} className="text-xl text-black flex flex-col justify-center items-center">
                        <Image src={`/assets/${gift.prefix}.png`} width={150} height={100} alt={gift.prefix} />
                        <span className="leading-4 mt-2">{gift.gift_label}</span>
                        <span>{gift.gift}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <Image src={`https://undangan.loofytech.com/${data.photos.filter((photo: any) => !photo.prefix)[0].photo}`} width={420} height={200} alt="" />
        </div>
      </div>
      {/* RSVP & Greetings */}
      <div className="px-[1em] py-[5em]" style={{backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #EFF2EC 100%)"}}>
        <h2 className="font-bodoni text-3xl text-cyan text-center italic">RSVP & Ucapan</h2>
        <div className="grid grid-cols-1 gap-[18px] px-5 mt-14">
          <input
            type="text"
            className="text-[13px] bg-white border-b border-cyan outline-none py-[4px] px-[6px] text-[#757575]"
            autoComplete="off"
            placeholder="Nama Kamu"
            defaultValue={subject}
            onChange={(evt) => setPronouncer(evt.target.value)}
          />
          <input
            type="text"
            className="text-[13px] bg-white border-b border-cyan outline-none py-[4px] px-[6px] text-[#757575]"
            autoComplete="off"
            placeholder="Hubungan (Saudara, Teman Kerja, Teman Kuliah, dll)"
            value={relation}
            onChange={(evt) => setRelation(evt.target.value)}
          />
          <textarea
            className="text-[13px] bg-white border-b border-cyan outline-none py-[4px] px-[6px] text-[#757575]"
            autoComplete="off"
            placeholder="Berikan Ucapan & Doa terbaik untuk Kedua Mempelai"
            rows={4}
            value={greeting}
            onChange={(evt) => setGreeting(evt.target.value)}
          >
            {/* {greeting} */}
          </textarea>
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center bg-cyan text-white uppercase gap-2 px-5 py-1.5 tracking-[2px] outline-none"
              onClick={sendGreetings}
            >
              Send
              <BsArrowRight />
            </button>
          </div>
        </div>
        {/* result command */}
        {greetings.length > 0 && <div className="flex flex-col gap-3 mt-10 px-5 max-h-[400px] overflow-y-auto">
          {greetings.map((as: any, it: number) => {
            return (
              <div key={it} className="bg-white p-3 border-b border-cyan">
                <div className="text-sm text-cyan font-semibold">{as.pronouncer}</div>
                <div className="flex items-center text-[11px] text-[#b9b9b9] gap-0.5">
                  <AiOutlineMinus className="mt-0.5" />
                  <span className="capitalize">{as.relation}</span>
                </div>
                <div className="text-sm leading-4 text-[#757575] mt-2">{as.greeting}</div>
              </div>
            )
          })}
        </div>}
        {/* end result command */}
        <div className="mt-20">
          <h2 className="text-center text-cyan uppercase font-semibold tracking-[2px]">Protokol Kesehatan</h2>
          <p className="text-[#757575] text-xs text-center leading-4 mt-3">Kami menghimbau para tamu undangan agar tetap memperhatikan protokol kesehatan.</p>
          <div className="grid grid-cols-3 mt-10">
            <div className="flex flex-col text-xs items-center text-center leading-3 text-cyan gap-3">
              <div className="w-[35px]">
                <svg xmlns="http://www.w3.org/2000/svg" id="fc335d76-f6f6-4d53-998a-33504ccd4493" data-name="Layer 1" viewBox="0 0 150 150"><defs></defs><title>protocol-2</title><path className="b4014e33-99de-4bff-a040-79cf4526fd82" d="M43.76,13.15c2.63,0,16.45,21.18,16.45,30.28a16.45,16.45,0,0,1-32.9,0c0-9.1,14-30.28,16.45-30.28Zm6.3-4.72a2.68,2.68,0,0,1-4-.53,2.79,2.79,0,0,1,.35-4c.17-.18,10.67-8.75,31.5.17l.17.18h.18s5.25,3.5,19.07-.35A3,3,0,0,1,101,6a2.92,2.92,0,0,1-2.1,3.67c-2.63.7-5.08,1.23-7.18,1.58V32.75h6.65a4,4,0,0,1,4,4v9.1H70.19v-9.1a4,4,0,0,1,4-4h6.13V11.05a12.67,12.67,0,0,1-4.9-1.57c-17.5-7.35-25.2-1.05-25.38-1.05Zm54.25,41a35.84,35.84,0,0,1,18.38,31.15v.17H49.89v-.17A35.85,35.85,0,0,1,68.26,49.38Zm18.38,34.3v43.57H49.89V83.68Zm0,46.37V142.3a7.62,7.62,0,0,1-7.53,7.7H57.41a7.73,7.73,0,0,1-7.52-7.7V130.05Zm-81-79.45V44.3h-6.3V39.93h6.3V33.8h4.2v6.13h6.3V44.3h-6.3v6.3Z" fill="#95A682"></path></svg>
              </div>
              Memakai Hand Sanitizer
            </div>
            <div className="flex flex-col text-xs items-center text-center leading-3 text-cyan gap-3">
              <div className="w-[35px]">
                 <svg xmlns="http://www.w3.org/2000/svg" id="b0fe75c6-692e-441c-ae95-117c49c47f25" data-name="Layer 1" viewBox="0 0 150 150"><defs></defs><title>protocol-5</title><path className="ff452229-05c2-4ff9-b426-bfc8edf0f91c" d="M15.94,60.3a1.18,1.18,0,0,1-.28-1.7,1.13,1.13,0,0,1,1.55-.28c.15,0,4.81,3.82,32.52-15.55h0c0-.14,12-9.05,24.32-9.48h1.27c12.3.43,24.31,9.34,24.31,9.48h0c27.71,19.37,32.52,15.55,32.52,15.55a1.32,1.32,0,0,1,1.7.28,1.35,1.35,0,0,1-.43,1.7s-6.08,4.8-35.2-15.7h0S86.49,36,74.75,35.7C63,36,51.14,44.6,51.14,44.6h0C22,65.1,15.94,60.3,15.94,60.3Zm96.56,43.12c2.69,3.67,6.36,5.09,10.32,4s8.62-4.52,14-9.89a49.55,49.55,0,0,0,11.59-17.81c2.12-6.23,2.26-11.88-.43-15.27-4.52-6.08-13.29-2-15.26-1C124,65,102.18,51.25,93.13,44.89a32.46,32.46,0,0,0-17.39-5.52H74.19a31.63,31.63,0,0,0-17.25,5.52C50.15,49.55,36.3,58.46,26.12,62l-5.94,1.42a10.5,10.5,0,0,1-3,0c-2-1-10.74-5.09-15.26,1-2.55,3.39-2.55,9-.29,15.27C3.64,85.6,7.74,92,13.11,97.48c5.52,5.37,10,8.76,14,9.89s7.63-.28,10.32-4a58.88,58.88,0,0,0,35.91,13.29h3.25c13-.43,25.87-4.81,35.91-13.29ZM73.76,91.26h2.41c9.19.42,14.7,5.23,18.66,8.9h0c-6.93-4.8-13.15-6.64-18.66-6.78h0l-.43-.14H74.19l-.43.14h0c-5.37.14-11.73,2-18.52,6.78h0c3.82-3.67,9.33-8.48,18.52-8.9ZM74.47,60h1c15.13.29,24.17,8.2,30.39,14h0c-11-7.78-21.2-10.46-30-10.74H74.05c-8.77.28-18.81,3-29.83,10.74h0c6.08-5.8,15.12-13.71,30.25-14ZM74.19,77.4h1.55c12.3.29,19.65,6.79,24.74,11.45h0c-9-6.36-17.39-8.62-24.6-8.76V80H74.19v.14c-7.35.14-15.7,2.4-24.74,8.76h0c5.09-4.66,12.44-11.16,24.74-11.45ZM19.33,75.14l.29.71.14.42v.14l.14.15V77h0l.14.42.14.14v.29l.14.28h0l.15.42.14.15V79l.14.28v.14h0l.56,1.13.14.43h0l.15.42.14.28v.15l.14.42H22l.14.42.43.85.14.43v.14l.14.28.14.28.14.14v.15l.43.7.14.29.14.14.14.42h0l.28.57v.14l.14.28.29.28v.14l.28.43v.14l.28.28.14.29v.14l.29.42v.14L26,90l.14.28.14.14.28.42h0l.29.43.14.28.14.14.28.43v.14l.29.42h0L28,93v.15l.28.28v.14l.42.42.15.29.28.42h0l.14.14.28.43h.14l.29.42.14.28h0l.42.43.14.14h0l.15.14.28.42h0l.28.29.28.42h0a8.59,8.59,0,0,0,1.13,1.13V99l.43.43.14.14h0l.42.42.15.14.14.15.42.42h0l.14.14.29.28.14.15.14.14.42.42c-2,2.83-4.8,4.1-7.77,3.25-3.54-1-7.78-4.24-13-9.33a46.15,46.15,0,0,1-10.89-17C2,73.44,1.8,68.64,3.78,66c3.68-5,11.6-.85,12.59-.28l1,.85h0v.14h0v.14h0v.14h0l.14.14h0v.14h0v.15h0v.14h0v.14h0v.14h.14v.14h0v.14h0v.14h0v.15h0v.14h.14v.14h0v.14h0v.14h0v.14h0v.14h.14v.15h0v.14Zm113.24-8.62,1-.85c1-.57,8.91-4.67,12.59.28,2,2.69,1.83,7.49,0,12.87a46.62,46.62,0,0,1-11,17c-5.09,5.09-9.47,8.34-12.87,9.33-3.11.85-5.93-.42-7.91-3.25,13.29-12.16,17.1-28.56,18.23-35.34Z" fill="#95A682"></path></svg>
              </div>
              Memakai Masker
            </div>
            <div className="flex flex-col text-xs items-center text-center leading-3 text-cyan gap-3">
              <div className="w-[35px]">
                <svg xmlns="http://www.w3.org/2000/svg" id="bc1ba8c6-6118-4909-9342-e897e4cbe163" data-name="Layer 1" viewBox="0 0 150 150"><defs></defs><title>protocol-3</title><path className="a29fadad-87cd-45dd-b870-cd004368b1e6" d="M72.27,133.17H61.85a7,7,0,0,1,1.19-2.9,14.17,14.17,0,0,1,3.25-3.08c1-.85,1.71-1.36,2-1.71a4.32,4.32,0,0,0,.34-1.19,1.33,1.33,0,0,0-.34-.86,1.49,1.49,0,0,0-1-.51,1.54,1.54,0,0,0-1.19.51,3.76,3.76,0,0,0-.52,1.37l-3.41-.17a6.66,6.66,0,0,1,.68-2.39,3.69,3.69,0,0,1,1.54-1.2,6,6,0,0,1,2.73-.51,6.87,6.87,0,0,1,2.91.51,2.73,2.73,0,0,1,1.53,1.2,4.05,4.05,0,0,1,.52,2.05,3.33,3.33,0,0,1-.69,2A6,6,0,0,1,69,128.56c-.68.51-1.2.85-1.37,1-.17.35-.51.52-.85.86h5.47ZM135.82,56C144.36,62.44,150,73.55,150,86.19v.68c-21.18,10.77-42.37,10.25-63.55,0v-.68c0-12.3,5.46-23.06,13.66-29.56A25.81,25.81,0,0,0,135.82,56ZM31.09,16.83A21.1,21.1,0,1,1,10.08,38a21.07,21.07,0,0,1,21-21.18ZM49.2,56c8.72,6.49,14.35,17.6,14.35,30.24v.68C42.37,97.64,21.18,97.12,0,86.87v-.68c0-12.3,5.47-23.06,13.67-29.56a25.55,25.55,0,0,0,17.42,6.84A24.74,24.74,0,0,0,49.2,56Zm68.34-39.12A21.1,21.1,0,1,1,96.53,38a21.06,21.06,0,0,1,21-21.18Zm-94,94.47,15.2-7.51v4.61h72.61v-4.61l15,7.51-15,7.52v-4.61H38.78v4.61Zm50.74,9.57h5l1.88,7.52,2-7.52h5v12.3H85.08v-9.39l-2.39,9.39H79.78l-2.39-9.39v9.39H74.32Z" fill="#95A682"></path></svg>
              </div>
              Menjaga Jarak
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="relative h-[460px]">
        <Slide arrows={false} duration={1000} indicators={false} transitionDuration={4000} autoplay={true} infinite={true} canSwipe={false}>
          {slideLast.map((d: any, i: number) => {
            return (
              <div className="each-slide-effect" key={i}>
                <div className="h-[460px]" style={{backgroundImage: `url(https://undangan.loofytech.com/${d.photo})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                    <span></span>
                </div>
              </div>
            )
          })}
        </Slide>
        <div className="absolute top-0 left-0 w-full h-full z-10" style={{backgroundImage: "linear-gradient(180deg, #A99D8700 0%, #95A682 100%)"}}>
          <div className="flex flex-col justify-center items-center w-full h-full px-10">
            <h2 className="font-bodoni text-white text-4xl italic text-center mb-10">Terimakasih</h2>
            <p className="text-xs leading-4 text-white text-center mb-10">Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do'a restu kepada kami.</p>
            <p className="uppercase text-white text-sm font-bold text-center tracking-[2px] mb-2">Kami yang berbahagia</p>
            <p className="font-bodoni text-white text-2xl text-center italic">{data.female_nickname} & {data.male_nickname}</p>
          </div>
        </div>
      </div>
      {/* Toggle Playback */}
      <div
        className={`fixed w-[30px] h-[30px] bg-cyan p-0.5 bottom-3 right-3 rounded-full z-20 ${!pauseBackSound ? "spin-backsound" : ""}`}
        onClick={toggleBackSound}
      >
        <div className="w-full text-cyan h-full rounded-full bg-white flex items-center justify-center">
          {pauseBackSound ? <FiPlayCircle size={22} /> : <FiActivity size={18} />}
        </div>
      </div>
      {/* Backsound */}
      <div className="hidden">
        <ReactAudioPlayer
          controls
          src={`https://undangan.loofytech.com/${data.backsound_link}`}
          autoPlay={true}
          loop={true}
          ref={backSound}
        />
      </div>
    </main>
  )
}