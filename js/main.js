/* ==========================================================================
   DogPedia - Master JavaScript
   สคริปต์ควบคุมการทำงานของทั้ง 6 หน้า
   - แบบฟอร์มติดต่อเรา (Contact Form Simulation)
   - แบบทดสอบเลือกสายพันธุ์ (Quiz Matcher Simulation)
   - การกรองและเปลี่ยนหน้าสายพันธุ์ (All Breeds - Size & Group Filter & Pagination)
   - ตัวค้นหาแบบเรียลไทม์ (Live Search)
   - ระบบเจาะลึก 7 กลุ่มสายพันธุ์สุนัข (Canine Group Explorer)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  console.log('DogPedia Front-End Loaded Successfully!');

  // ข้อมูลรายละเอียด 7 กลุ่มสายพันธุ์มาตรฐานสากล
  const canineGroupData = {
    'sporting': {
      name: 'Sporting Group (สุนัขล่าสัตว์และเก็บเหยื่อ)',
      shortName: 'Sporting',
      desc: 'กลุ่มที่มีสัญชาตญาณในการหา ค้นหา ชี้เป้า หรือเก็บเหยื่อ (โดยเฉพาะนกน้ำ/สัตว์ปีก) เชี่ยวชาญทั้งบนบกและในน้ำ',
      count: 3
    },
    'hound': {
      name: 'Hound Group (สุนัขล่าสัตว์ดมกลิ่นและสายตา)',
      shortName: 'Hound',
      desc: 'กลุ่มที่พัฒนามาเพื่อตามล่าเหยื่อด้วยการดมกลิ่นตามรอย (Scenthound) หรือการมองเห็นและวิ่งไล่ล่า (Sighthound)',
      count: 3
    },
    'working': {
      name: 'Working Group (สุนัขทำงานและอารักขา)',
      shortName: 'Working',
      desc: 'กลุ่มที่มีพละกำลัง ร่างกายแข็งแรง ใช้สำหรับงานลากเลื่อน เฝ้าสถานที่ อารักขา และงานกู้ภัย',
      count: 6
    },
    'terrier': {
      name: 'Terrier Group (สุนัขเทอร์เรียร์)',
      shortName: 'Terrier',
      desc: 'กลุ่มที่ขึ้นชื่อเรื่องความกล้าหาญ มุ่งมั่น ว่องไว แต่เดิมพัฒนามาเพื่อมุดโพรงและล่าสัตว์ฟันแทะ/สัตว์รังควาน',
      count: 3
    },
    'toy': {
      name: 'Toy Group (สุนัขพันธุ์จิ๋วเลี้ยงเป็นเพื่อน)',
      shortName: 'Toy',
      desc: 'กลุ่มสุนัขขนาดเล็กกะทัดรัด นิยมเลี้ยงไว้เป็นเพื่อนคู่ใจ พกพาง่าย ขี้อ้อน ช่างเอาใจ',
      count: 7
    },
    'herding': {
      name: 'Herding Group (สุนัขต้อนฝูงสัตว์)',
      shortName: 'Herding',
      desc: 'กลุ่มที่มีสัญชาตญาณในการควบคุม ควบคุมทิศทาง และต้อนฝูงสัตว์ เช่น แกะหรือวัว ฉลาดและฝึกง่ายมาก',
      count: 4
    },
    'non-sporting': {
      name: 'Non-Sporting Group (สุนัขเบ็ดเตล็ด / อเนกประสงค์)',
      shortName: 'Non-Sporting',
      desc: 'กลุ่มที่มีความหลากหลายทางด้านขนาด รูปร่าง และลักษณะนิสัย ส่วนใหญ่เป็นสุนัขเพื่อนคู่ใจหรือสุนัขเฝ้าบ้าน',
      count: 4
    }
  };

  // --------------------------------------------------------------------------
  // 1. ระบบจำลองการส่งแบบฟอร์มติดต่อเรา (Contact Form Simulation - contact.html)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value || 'คุณ';
      const successAlert = document.getElementById('contactAlertSuccess');

      if (successAlert) {
        successAlert.classList.remove('d-none');
        successAlert.innerHTML = `<strong>ขอบคุณ ${name}!</strong> ทางเราได้รับข้อความเรียบร้อยแล้ว และจะติดต่อกลับโดยเร็วที่สุด`;
      } else {
        alert(`ขอบคุณ ${name}! ได้รับข้อความสอบถามเรียบร้อยแล้ว`);
      }

      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 2. ระบบฐานข้อมูลสุนัขครบทั้ง 30 สายพันธุ์ และระบบค้นหาสายพันธุ์ที่เหมาะกับคุณ
  //    (Dog Matcher & 30 Breeds Lifestyle Directory - quiz.html)
  // --------------------------------------------------------------------------
  const all30BreedsData = [
    // --- 1. สุนัขพันธุ์เล็ก (10 สายพันธุ์) ---
    {
      id: 'pomeranian',
      nameTh: 'ปอมเมอเรเนียน',
      nameEn: 'Pomeranian',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '1.5 - 3.5 กก.',
      lifespan: '12-16 ปี',
      image: 'Assets/images/Small breeds/Pomeranian.jpg',
      desc: 'ขนฟูแน่น ตื่นตัว ขี้เล่น รักเจ้าของมาก เป็นเพื่อนคลายเหงาชั้นยอด',
      traits: ['ร่าเริง', 'ขี้อ้อน', 'ตื่นตัว'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'companion', 'family']
    },
    {
      id: 'chihuahua',
      nameTh: 'ชิวาวา',
      nameEn: 'Chihuahua',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '1 - 3 กก.',
      lifespan: '14-18 ปี',
      image: 'Assets/images/Small breeds/Chihuahua.jpg',
      desc: 'ตัวเล็กที่สุดในโลก พกพาง่าย กล้าหาญและหวงเจ้าของ เหมาะกับคอนโด',
      traits: ['ตัวจิ๋วพกพาง่าย', 'กล้าหาญ', 'หวงเจ้าของ'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'low',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['companion'],
      lifestyleTags: ['condo', 'companion', 'low_groom', 'beginner']
    },
    {
      id: 'toy-poodle',
      nameTh: 'พุดเดิ้ล ทอย',
      nameEn: 'Toy Poodle',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '2 - 4 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Small breeds/toy poodle.jpg',
      desc: 'ฉลาดเป็นอันดับต้นๆ ฝึกง่าย ขนหยิกไม่ค่อยผลัด เหมาะกับคนเป็นภูมิแพ้',
      traits: ['ฉลาดมาก', 'ฝึกง่าย', 'ขนไม่ค่อยร่วง'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'family', 'beginner', 'companion']
    },
    {
      id: 'yorkshire-terrier',
      nameTh: 'ยอร์กเชียร์ เทอร์เรียร์',
      nameEn: 'Yorkshire Terrier',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '2 - 3.2 กก.',
      lifespan: '11-15 ปี',
      image: 'Assets/images/Small breeds/yorkshire terrier.jpg',
      desc: 'ขนยาวเงางามคล้ายเส้นผม บุคลิกมั่นใจ ร่าเริง ชอบอยู่ใกล้ชิดเจ้าของ',
      traits: ['มั่นใจ', 'ขนสวยเงางาม', 'ร่าเริง'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['companion'],
      lifestyleTags: ['condo', 'companion']
    },
    {
      id: 'shih-tzu',
      nameTh: 'ชิสุ',
      nameEn: 'Shih Tzu',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '4 - 7.5 กก.',
      lifespan: '10-16 ปี',
      image: 'Assets/images/Small breeds/shih tzu.jpg',
      desc: 'นิสัยนิ่ง เป็นมิตร ใจดี เข้ากับเด็กและสัตว์อื่นได้ดี ขนยาวนุ่มน่ากอด',
      traits: ['ใจดี', 'รักเด็ก', 'ขี้อ้อนสงบ'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'low',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'family', 'beginner', 'companion']
    },
    {
      id: 'pug',
      nameTh: 'ปั๊ก',
      nameEn: 'Pug',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '6 - 8 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Small breeds/pug.jpg',
      desc: 'หน้าสั้น อารมณ์ดี ตลก ขี้อ้อน ไม่ค่อยเห่า ชอบนอนข้างๆ เจ้าของ',
      traits: ['อารมณ์ดี', 'ไม่ค่อยเห่า', 'ชอบนอนข้างๆ'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'low',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'companion', 'beginner', 'low_groom']
    },
    {
      id: 'maltese',
      nameTh: 'มอลทีส',
      nameEn: 'Maltese',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'toy',
      groupName: 'Toy Group',
      weight: '2 - 4 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Small breeds/maltese.jpg',
      desc: 'ขนสีขาวล้วน นุ่มสลวย อ่อนโยน เรียบร้อย ชอบให้อุ้มและติดคนมาก',
      traits: ['อ่อนโยน', 'เรียบร้อย', 'ชอบให้อุ้ม'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'low',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['companion'],
      lifestyleTags: ['condo', 'companion', 'beginner']
    },
    {
      id: 'jack-russell',
      nameTh: 'แจ็ครัสเซลล์ เทอร์เรียร์',
      nameEn: 'Jack Russell Terrier',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'terrier',
      groupName: 'Terrier Group',
      weight: '5 - 6 กก.',
      lifespan: '12-14 ปี',
      image: 'Assets/images/Small breeds/jack russell terrier.jpg',
      desc: 'พลังงานล้นเหลือ คล่องแคล่ว ฉลาด ชอบวิ่งและไล่จับสิ่งของ ต้องการการออกกำลังกาย',
      traits: ['พลังงานสูง', 'คล่องแคล่ว', 'ฉลาดกล้าหาญ'],
      spaces: ['townhome', 'house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['active', 'guard'],
      lifestyleTags: ['active', 'low_groom']
    },
    {
      id: 'dachshund',
      nameTh: 'ดัชชุน / หมาไส้กรอก',
      nameEn: 'Dachshund',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'hound',
      groupName: 'Hound Group',
      weight: '7 - 14 กก.',
      lifespan: '12-16 ปี',
      image: 'Assets/images/Small breeds/Dachshund.jpg',
      desc: 'ตัวยาวขาสั้น ดมกลิ่นเก่ง ขี้สงสัย ซื่อสัตย์ ปรับตัวเข้ากับที่พักได้ดี',
      traits: ['ขาสั้นตัวยาว', 'ดมกลิ่นเก่ง', 'ซื่อสัตย์'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'low_groom', 'companion']
    },
    {
      id: 'french-bulldog',
      nameTh: 'เฟรนช์ บูลด็อก',
      nameEn: 'French Bulldog',
      size: 'small',
      sizeName: 'พันธุ์เล็ก (≤ 10 กก.)',
      group: 'non-sporting',
      groupName: 'Non-Sporting Group',
      weight: '8 - 14 กก.',
      lifespan: '10-12 ปี',
      image: 'Assets/images/Small breeds/french-bulldog.jpg',
      desc: 'หน้าสั้น หูตั้ง ตัวตันกะทัดรัด นิสัยสงบ ไม่ชอบเห่า เหมาะกับวิถีชีวิตคนเมืองในคอนโด',
      traits: ['ไม่ชอบเห่า', 'นิสัยสงบ', 'น่ารักเป็นมิตร'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'low',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'companion', 'beginner', 'low_groom']
    },

    // --- 2. สุนัขพันธุ์กลาง (10 สายพันธุ์) ---
    {
      id: 'corgi',
      nameTh: 'พ็อมโบรค เวลช์ คอร์กี้',
      nameEn: 'Pembroke Welsh Corgi',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'herding',
      groupName: 'Herding Group',
      weight: '10 - 14 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Medium breeds/Pembroke Welsh Corgi.jpg',
      desc: 'ขาสั้น บั้นท้ายกลม อารมณ์ดี ฉลาด ขี้เล่น ปรับตัวเข้ากับครอบครัวได้ดีเยี่ยม',
      traits: ['อารมณ์ดี', 'ฉลาด', 'ขี้เล่น'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['family', 'companion'],
      lifestyleTags: ['family', 'companion', 'beginner']
    },
    {
      id: 'beagle',
      nameTh: 'บีเกิ้ล',
      nameEn: 'Beagle',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'hound',
      groupName: 'Hound Group',
      weight: '9 - 11 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Medium breeds/beagle.jpg',
      desc: 'จมูกไวเป็นเลิศ กระตือรือร้น ชอบสังคม เป็นมิตรกับทุกคนและเด็กๆ',
      traits: ['จมูกไว', 'กระตือรือร้น', 'เป็นมิตรกับทุกคน'],
      spaces: ['townhome', 'house'],
      energy: 'high',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['family', 'active'],
      lifestyleTags: ['family', 'active', 'low_groom', 'beginner']
    },
    {
      id: 'shiba-inu',
      nameTh: 'ชิบะ อินุ',
      nameEn: 'Shiba Inu',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'non-sporting',
      groupName: 'Non-Sporting Group',
      weight: '8 - 10 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Medium breeds/shiba-inu.jpg',
      desc: 'สายพันธุ์จากญี่ปุ่น มีความมั่นใจสูง รักความสะอาด รักอิสระ คล้ายแมวและซื่อสัตย์',
      traits: ['รักสะอาด', 'รักอิสระ', 'มั่นใจสูง'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['companion', 'guard'],
      lifestyleTags: ['companion', 'guard']
    },
    {
      id: 'thai-bangkaew',
      nameTh: 'ไทยบางแก้ว',
      nameEn: 'Thai Bangkaew Dog',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'non-sporting',
      groupName: 'Non-Sporting Group',
      weight: '13 - 16 กก.',
      lifespan: '10-14 ปี',
      image: 'Assets/images/Medium breeds/thai bangkaew.jpg',
      desc: 'สุนัขไทยแท้ ขนฟูสวย รักเจ้าของ หวงอาณาเขต ฉลาดและดุดันเมื่อจำเป็น เฝ้าบ้านยอดเยี่ยม',
      traits: ['หวงอาณาเขต', 'รักเจ้าของคนเดียว', 'เฝ้าบ้านเยี่ยม'],
      spaces: ['townhome', 'house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['guard'],
      lifestyleTags: ['guard']
    },
    {
      id: 'border-collie',
      nameTh: 'บอร์เดอร์ คอลลี่',
      nameEn: 'Border Collie',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'herding',
      groupName: 'Herding Group',
      weight: '14 - 20 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Medium breeds/border collie.jpg',
      desc: 'สุนัขที่ฉลาดที่สุดในโลก คล่องแคล่ว มีสมาธิสูง ต้องการการออกกำลังกายสม่ำเสมอ',
      traits: ['ฉลาดที่สุดในโลก', 'สมาธิสูง', 'พลังงานล้นเหลือ'],
      spaces: ['house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['active'],
      lifestyleTags: ['active']
    },
    {
      id: 'english-cocker-spaniel',
      nameTh: 'อิงลิช ค็อกเกอร์ สเปเนียล',
      nameEn: 'English Cocker Spaniel',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'sporting',
      groupName: 'Sporting Group',
      weight: '13 - 15 กก.',
      lifespan: '12-14 ปี',
      image: 'Assets/images/Medium breeds/english cocker spaniel.jpg',
      desc: 'หูยาวเป็นลอน นิสัยอ่อนโยน กระตือรือร้น รักการว่ายน้ำและเก็บของ เข้ากับเด็กได้ดี',
      traits: ['อ่อนโยน', 'รักการว่ายน้ำ', 'เข้ากับเด็กได้ดี'],
      spaces: ['townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['family', 'active'],
      lifestyleTags: ['family', 'active', 'beginner']
    },
    {
      id: 'english-bulldog',
      nameTh: 'บูลด็อก / อิงลิช บูลด็อก',
      nameEn: 'English Bulldog',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'non-sporting',
      groupName: 'Non-Sporting Group',
      weight: '18 - 23 กก.',
      lifespan: '8-10 ปี',
      image: 'Assets/images/Medium breeds/english bulldog.jpg',
      desc: 'ตัวเตี้ยล่ำ หน้าพับย่น ใจเย็น รักสงบ ไม่ค่อยชอบวิ่ง ชอบนอนเป็นหลัก ขนสั้นดูแลง่าย',
      traits: ['รักสงบ', 'ใจเย็น', 'ไม่ชอบวิ่ง'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'low',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['companion', 'family'],
      lifestyleTags: ['condo', 'companion', 'beginner', 'low_groom']
    },
    {
      id: 'miniature-schnauzer',
      nameTh: 'มินิเจอร์ ชเนาเซอร์',
      nameEn: 'Miniature Schnauzer',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'terrier',
      groupName: 'Terrier Group',
      weight: '5 - 9 กก.',
      lifespan: '12-15 ปี',
      image: 'Assets/images/Medium breeds/miniature schnauzer.jpg',
      desc: 'เคราเด่นชัด ฉลาด ตื่นตัว ปรับตัวง่าย เห่าเตือนภัยได้ดี ขนไม่ค่อยร่วง',
      traits: ['ขนไม่ค่อยร่วง', 'เตือนภัยเก่ง', 'ฉลาดเลี้ยงง่าย'],
      spaces: ['condo', 'townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['family', 'guard', 'companion'],
      lifestyleTags: ['condo', 'family', 'beginner', 'guard']
    },
    {
      id: 'shetland-sheepdog',
      nameTh: 'เชลตี / เชตแลนด์ ชีพด็อก',
      nameEn: 'Shetland Sheepdog',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'herding',
      groupName: 'Herding Group',
      weight: '6 - 12 กก.',
      lifespan: '12-14 ปี',
      image: 'Assets/images/Medium breeds/Shetland_Sheepdog.jpg',
      desc: 'คล้ายคอลลี่ขนาดย่อส่วน ขนหนาสวย ฉลาด ว่านอนสอนง่าย ซื่อสัตย์ต่อครอบครัว',
      traits: ['สอนง่าย', 'ซื่อสัตย์', 'ฉลาดมาก'],
      spaces: ['townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['family', 'companion'],
      lifestyleTags: ['family', 'companion', 'beginner']
    },
    {
      id: 'bull-terrier',
      nameTh: 'บูลเทอร์เรียร์',
      nameEn: 'Bull Terrier',
      size: 'medium',
      sizeName: 'พันธุ์กลาง (10–25 กก.)',
      group: 'terrier',
      groupName: 'Terrier Group',
      weight: '22 - 38 กก.',
      lifespan: '10-14 ปี',
      image: 'Assets/images/Medium breeds/bull terrier.jpg',
      desc: 'ศีรษะทรงไข่เป็นเอกลักษณ์ กล้ามเนื้อแน่น ขี้เล่น ซุกซน พลังงานสูง ขนสั้นเตียน',
      traits: ['กล้ามเนื้อแน่น', 'ซุกซน', 'ขี้เล่น'],
      spaces: ['townhome', 'house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['active', 'guard'],
      lifestyleTags: ['active', 'low_groom']
    },

    // --- 3. สุนัขพันธุ์ใหญ่ (10 สายพันธุ์) ---
    {
      id: 'golden-retriever',
      nameTh: 'โกลเด้น รีทรีฟเวอร์',
      nameEn: 'Golden Retriever',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'sporting',
      groupName: 'Sporting Group',
      weight: '25 - 34 กก.',
      lifespan: '10-12 ปี',
      image: 'Assets/images/Large breeds/Golden Retriever.jpg',
      desc: 'เป็นมิตร ใจดี ฉลาด รักทุกคน เหมาะกับครอบครัวและเด็กๆ เป็นเพื่อนแท้คู่ใจ',
      traits: ['เป็นมิตรกับทุกคน', 'ใจดี', 'รักเด็ก'],
      spaces: ['townhome', 'house'],
      energy: 'medium',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['family', 'companion'],
      lifestyleTags: ['family', 'beginner', 'companion']
    },
    {
      id: 'labrador-retriever',
      nameTh: 'ลาบราดอร์ รีทรีฟเวอร์',
      nameEn: 'Labrador Retriever',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'sporting',
      groupName: 'Sporting Group',
      weight: '25 - 36 กก.',
      lifespan: '10-12 ปี',
      image: 'Assets/images/Large breeds/Labrador Retriever.jpg',
      desc: 'แข็งแรง กระตือรือร้น ว่านอนสอนง่าย ขนสั้นดูแลง่าย นิยมฝึกเป็นสุนัขช่วยเหลือ',
      traits: ['สอนง่าย', 'รักการเล่นน้ำ', 'จิตใจดีมาก'],
      spaces: ['townhome', 'house'],
      energy: 'high',
      experience: ['beginner', 'experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['family', 'active'],
      lifestyleTags: ['family', 'beginner', 'active', 'low_groom']
    },
    {
      id: 'siberian-husky',
      nameTh: 'ไซบีเรียน ฮัสกี้',
      nameEn: 'Siberian Husky',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'working',
      groupName: 'Working Group',
      weight: '16 - 27 กก.',
      lifespan: '12-14 ปี',
      image: 'Assets/images/Large breeds/Siberian Husky.jpg',
      desc: 'หน้าตาหล่อเท่ ตาฟ้าหรือสองสี พลังงานล้น ตลก ช่างพูด อารมณ์ศิลปินและชอบวิ่ง',
      traits: ['ตลกช่างพูด', 'พลังงานล้น', 'เป็นมิตร'],
      spaces: ['house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['active'],
      lifestyleTags: ['active']
    },
    {
      id: 'german-shepherd',
      nameTh: 'เยอรมัน เชพเพิร์ด',
      nameEn: 'German Shepherd',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'herding',
      groupName: 'Herding Group',
      weight: '22 - 40 กก.',
      lifespan: '9-13 ปี',
      image: 'Assets/images/Large breeds/German Shepherd.jpg',
      desc: 'ฉลาด กล้าหาญ จงรักภักดี ยอดสุนัขตำรวจและอารักขา ฝึกได้สารพัดประโยชน์',
      traits: ['ฉลาดมาก', 'ซื่อสัตย์ภักดี', 'อารักขายอดเยี่ยม'],
      spaces: ['house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['guard', 'active'],
      lifestyleTags: ['guard', 'active']
    },
    {
      id: 'thai-ridgeback',
      nameTh: 'ไทยหลังอาน',
      nameEn: 'Thai Ridgeback Dog',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'hound',
      groupName: 'Hound Group',
      weight: '25 - 34 กก.',
      lifespan: '12-14 ปี',
      image: 'Assets/images/Large breeds/Thai Ridgeback.jpg',
      desc: 'สุนัขพื้นเมืองไทยแท้ มีอานบนหลัง แข็งแรง ปราดเปรียว รักษาอาณาเขตได้ดี ขนสั้น',
      traits: ['อานบนหลัง', 'ปราดเปรียว', 'รักถิ่นฐาน'],
      spaces: ['townhome', 'house'],
      energy: 'medium',
      experience: ['experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['guard', 'active'],
      lifestyleTags: ['guard', 'low_groom']
    },
    {
      id: 'rottweiler',
      nameTh: 'ร็อตไวเลอร์',
      nameEn: 'Rottweiler',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'working',
      groupName: 'Working Group',
      weight: '35 - 60 กก.',
      lifespan: '9-10 ปี',
      image: 'Assets/images/Large breeds/Rottweiler.jpg',
      desc: 'บึกบึน แข็งแกร่ง อารักขาขั้นสูง ซื่อสัตย์ต่อเจ้าของ ต้องฝึกอย่างถูกวิธี เฝ้าบ้านยอดเยี่ยม',
      traits: ['แข็งแกร่ง', 'อารักขาเยี่ยม', 'ซื่อสัตย์'],
      spaces: ['house'],
      energy: 'high',
      experience: ['expert'],
      grooming: 'low_groom',
      purposes: ['guard'],
      lifestyleTags: ['guard', 'low_groom']
    },
    {
      id: 'doberman-pinscher',
      nameTh: 'โดเบอร์แมน พินเชอร์',
      nameEn: 'Doberman Pinscher',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'working',
      groupName: 'Working Group',
      weight: '32 - 45 กก.',
      lifespan: '10-12 ปี',
      image: 'Assets/images/Large breeds/Doberman Pinscher.jpg',
      desc: 'สง่างาม ปราดเปรียว ว่องไว ยามรักษาความปลอดภัยชั้นยอด ซื่อสัตย์และฉลาด ขนสั้นเงา',
      traits: ['ปราดเปรียว', 'สง่างาม', 'เฝ้าระวังดีเลิศ'],
      spaces: ['house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['guard', 'active'],
      lifestyleTags: ['guard', 'active', 'low_groom']
    },
    {
      id: 'alaskan-malamute',
      nameTh: 'อะแลสกัน มาลามิวต์',
      nameEn: 'Alaskan Malamute',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'working',
      groupName: 'Working Group',
      weight: '34 - 38 กก.',
      lifespan: '10-14 ปี',
      image: 'Assets/images/Large breeds/Alaskan Malamute.jpg',
      desc: 'สุนัขลากเลื่อนโบราณ โครงสร้างใหญ่ ขนหนาสองชั้น สง่างามและใจดี',
      traits: ['ตัวใหญ่สง่างาม', 'ใจดี', 'พลังลากเลื่อน'],
      spaces: ['house'],
      energy: 'high',
      experience: ['experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['active', 'family'],
      lifestyleTags: ['active', 'family']
    },
    {
      id: 'great-dane',
      nameTh: 'เกรทเดน',
      nameEn: 'Great Dane',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'working',
      groupName: 'Working Group',
      weight: '45 - 90 กก.',
      lifespan: '7-10 ปี',
      image: 'Assets/images/Large breeds/Great Dane.jpg',
      desc: 'ยักษ์ใหญ่ใจดี ตัวสูงใหญ่ที่สุดสายพันธุ์หนึ่ง สงบนิ่ง อ่อนโยนกับคนในบ้าน ขนสั้น',
      traits: ['ยักษ์ใหญ่ใจดี', 'สงบนิ่ง', 'อ่อนโยน'],
      spaces: ['house'],
      energy: 'low',
      experience: ['experienced', 'expert'],
      grooming: 'low_groom',
      purposes: ['companion', 'guard'],
      lifestyleTags: ['companion', 'low_groom']
    },
    {
      id: 'samoyed',
      nameTh: 'ซามอยด์',
      nameEn: 'Samoyed',
      size: 'large',
      sizeName: 'พันธุ์ใหญ่ (≥ 25 กก.)',
      group: 'working',
      groupName: 'Working Group',
      weight: '16 - 30 กก.',
      lifespan: '12-14 ปี',
      image: 'Assets/images/Large breeds/Samoyd.jpg',
      desc: 'รอยยิ้มซามอยด์ ขนสีขาวปุกปุย อารมณ์ดี อ่อนโยน เข้ากับทุกคนได้ง่าย เป็นมิตร',
      traits: ['รอยยิ้มซามอยด์', 'ขนขาวฟูนุ่ม', 'อารมณ์ดีมาก'],
      spaces: ['house'],
      energy: 'medium',
      experience: ['experienced', 'expert'],
      grooming: 'high_groom',
      purposes: ['family', 'companion'],
      lifestyleTags: ['family', 'companion']
    }
  ];

  // Helper คืนค่าสี Badge ของขนาดตัว
  function getSizeBadgeClass(size) {
    if (size === 'small') return 'bg-warning text-dark';
    if (size === 'medium') return 'bg-success text-white';
    return 'bg-primary text-white';
  }

  // --- 2.1 ระบบเลือกดูสุนัขทั้งหมดตามไลฟ์สไตล์ (All 30 Breeds Directory) ---
  const lifestyleGrid = document.getElementById('lifestyleBreedsGrid');
  const lifestyleFilterBtns = document.querySelectorAll('.lifestyle-filter-btn');
  const lifestyleFilterStatus = document.getElementById('lifestyleFilterStatus');

  function renderLifestyleBreeds(filter = 'all') {
    if (!lifestyleGrid) return;

    let filtered = all30BreedsData;
    if (filter !== 'all') {
      filtered = all30BreedsData.filter(dog => dog.lifestyleTags.includes(filter));
    }

    if (lifestyleFilterStatus) {
      if (filter === 'all') {
        lifestyleFilterStatus.textContent = `แสดงครบทั้ง 30 สายพันธุ์ จากทุกกลุ่มและทุกขนาด`;
      } else {
        lifestyleFilterStatus.textContent = `พบ ${filtered.length} จาก 30 สายพันธุ์ ที่เข้าเกณฑ์นี้`;
      }
    }

    lifestyleGrid.innerHTML = '';
    filtered.forEach(dog => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="card custom-card h-100 breed-item-card shadow-sm">
          <img src="${dog.image}" class="card-img-top breed-card-img" alt="${dog.nameTh} (${dog.nameEn})" loading="lazy" onerror="this.src='images/breeds/default.svg'">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
              <div>
                <span class="badge ${getSizeBadgeClass(dog.size)}">${dog.sizeName}</span>
                <span class="badge bg-light text-dark border">${dog.groupName}</span>
              </div>
              <span class="text-muted small"><i class="fa-regular fa-clock me-1"></i>${dog.lifespan}</span>
            </div>
            <h5 class="card-title fw-bold text-dark mb-1">${dog.nameTh}</h5>
            <div class="text-secondary small mb-2 fst-italic">(${dog.nameEn})</div>
            <p class="card-text text-muted small flex-grow-1 mb-3">${dog.desc}</p>
            
            <div class="d-flex flex-wrap gap-1 mb-3">
              ${dog.traits.map(t => `<span class="badge bg-light text-secondary border">#${t}</span>`).join('')}
            </div>

            <div class="border-top pt-2 small text-secondary mb-3">
              <div><i class="fa-solid fa-weight-hanging text-warning me-2"></i>น้ำหนัก: ${dog.weight}</div>
            </div>

            <div class="d-grid gap-2">
              <a href="breeds.html?search=${encodeURIComponent(dog.nameTh)}" class="btn btn-sm btn-outline-warning text-dark">
                <i class="fa-solid fa-circle-info me-1"></i> ดูรายละเอียดสายพันธุ์
              </a>
            </div>
          </div>
        </div>
      `;
      lifestyleGrid.appendChild(col);
    });
  }

  // เรียกแสดงผลเริ่มต้นทั้ง 30 สายพันธุ์
  if (lifestyleGrid) {
    renderLifestyleBreeds('all');

    lifestyleFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        lifestyleFilterBtns.forEach(b => {
          b.classList.remove('active', 'btn-warning');
          b.classList.add('btn-outline-secondary');
        });
        this.classList.add('active', 'btn-warning');
        this.classList.remove('btn-outline-secondary');

        const filter = this.getAttribute('data-filter');
        renderLifestyleBreeds(filter);
      });
    });
  }

  // --- 2.2 ระบบประมวลผลคำนวณความเหมาะสม (Dog Quiz Matcher Algorithm) ---
  const quizForm = document.getElementById('dogQuizForm');
  const quizResultSection = document.getElementById('quizResultSection');
  const bestMatchSpotlight = document.getElementById('bestMatchSpotlight');
  const runnerUpMatchesRow = document.getElementById('runnerUpMatchesRow');
  const otherMatchesRow = document.getElementById('otherMatchesRow');
  const quizSummaryCriteria = document.getElementById('quizResultSummaryCriteria');
  const resetQuizBtn = document.getElementById('resetQuizBtn');
  const formResetQuickBtn = document.getElementById('formResetQuickBtn');

  function calculateMatches(answers) {
    const { space, energy, exp, groom, purpose } = answers;

    const scoredBreeds = all30BreedsData.map(dog => {
      let score = 0;
      let reasons = [];

      // 1. คะแนนพื้นที่อยู่อาศัย (25 คะแนน)
      if (dog.spaces.includes(space)) {
        score += 25;
        if (space === 'condo') reasons.push('ขนาดกะทัดรัด เหมาะกับพื้นที่จำกัดอย่างคอนโด');
        else if (space === 'townhome') reasons.push('ปรับตัวได้ดีกับบ้านทาวน์โฮม');
        else reasons.push('เหมาะกับบ้านเดี่ยวที่มีสนามหญ้าให้วิ่งเล่น');
      } else {
        if (space === 'condo' && dog.size === 'large') {
          score -= 15; // หักคะแนนกรณีคอนโดแต่ตัวใหญ่มาก
        } else {
          score += 10;
        }
      }

      // 2. คะแนนพลังงานและเวลาออกกำลังกาย (25 คะแนน)
      if (dog.energy === energy) {
        score += 25;
        if (energy === 'low') reasons.push('ระดับพลังงานต่ำ เหมาะกับการพักผ่อนในบ้าน ไม่จำเป็นต้องวิ่งหนัก');
        else if (energy === 'medium') reasons.push('พลังงานปานกลาง ออกกำลังกายวันละ 30-60 นาทีได้อย่างลงตัว');
        else reasons.push('พลังงานล้นเหลือ พร้อมเป็นคู่หูกิจกรรมกลางแจ้งและวิ่งออกกำลังกาย');
      } else if (
        (energy === 'low' && dog.energy === 'medium') ||
        (energy === 'medium' && (dog.energy === 'low' || dog.energy === 'high')) ||
        (energy === 'high' && dog.energy === 'medium')
      ) {
        score += 15;
      } else {
        score += 5;
      }

      // 3. คะแนนเป้าหมายและนิสัยหลัก (25 คะแนน)
      if (dog.purposes.includes(purpose)) {
        score += 25;
        if (purpose === 'companion') reasons.push('นิสัยติดคน ขี้อ้อน และเป็นเพื่อนคลายเหงาชั้นยอด');
        else if (purpose === 'family') reasons.push('ใจดี เป็นมิตรสูง เข้ากับสมาชิกทุกคนและเด็กๆ ได้ดี');
        else if (purpose === 'active') reasons.push('คล่องแคล่ว ปราดเปรียว รักการผจญภัยและกิจกรรมลุยๆ');
        else if (purpose === 'guard') reasons.push('ซื่อสัตย์ มีสัญชาตญาณระวังภัย และช่วยเฝ้าบ้านได้ดี');
      } else {
        score += 10;
      }

      // 4. คะแนนการดูแลขนและกรูมมิ่ง (15 คะแนน)
      if (dog.grooming === groom) {
        score += 15;
        if (groom === 'low_groom') reasons.push('ขนสั้น ดูแลง่าย อาบน้ำเป่าแห้งไว ขนไม่ร่วงเยอะ');
        else reasons.push('ขนยาวฟูสวยงาม โดดเด่น สง่างามตามที่คุณชื่นชอบ');
      } else {
        score += 6;
      }

      // 5. คะแนนประสบการณ์ของผู้เลี้ยง (10 คะแนน)
      if (dog.experience.includes(exp)) {
        score += 10;
        if (exp === 'beginner') reasons.push('นิสัยว่านอนสอนง่าย เหมาะสำหรับผู้เริ่มต้นเลี้ยงตัวแรก');
      } else {
        if (exp === 'beginner' && dog.experience.length === 1 && dog.experience[0] === 'expert') {
          score -= 10; // สุนัขที่ต้องการมืออาชีพ
        } else {
          score += 4;
        }
      }

      // คำนวณเป็นเปอร์เซ็นต์ (จำกัดระหว่าง 60% ถึง 98%)
      const matchPercentage = Math.min(98, Math.max(58, score));

      return {
        ...dog,
        score: matchPercentage,
        reasons: reasons.slice(0, 3) // เอา 3 เหตุผลเด่นที่สุด
      };
    });

    // เรียงลำดับจากคะแนนสูงสุดไปต่ำสุด
    scoredBreeds.sort((a, b) => b.score - a.score);
    return scoredBreeds;
  }

  // ส่งแบบฟอร์มคำนวณผล
  if (quizForm) {
    quizForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const space = quizForm.elements['q1']?.value || 'condo';
      const energy = quizForm.elements['q2']?.value || 'medium';
      const exp = quizForm.elements['q3']?.value || 'beginner';
      const groom = quizForm.elements['q4']?.value || 'low_groom';
      const purpose = quizForm.elements['q5']?.value || 'companion';

      const results = calculateMatches({ space, energy, exp, groom, purpose });
      const best = results[0];
      const runnerUps = results.slice(1, 3);
      const otherMatches = results.slice(3, 9);

      // แปลงค่า Criteria สรุป
      const spaceMap = { condo: 'คอนโด/อพาร์ตเมนต์', townhome: 'ทาวน์โฮม', house: 'บ้านเดี่ยวมีสวน' };
      const energyMap = { low: 'น้อยกว่า 30 นาที/วัน', medium: '30-60 นาที/วัน', high: 'มากกว่า 1 ชม./วัน' };
      const purposeMap = { companion: 'เพื่อนรู้ใจ/ขี้อ้อน', family: 'สุนัขครอบครัว/รักเด็ก', active: 'คู่หูสายลุย', guard: 'เฝ้าบ้าน/อารักขา' };

      if (quizSummaryCriteria) {
        quizSummaryCriteria.innerHTML = `
          <strong>เกณฑ์ของคุณ:</strong> ที่พัก: <span class="badge bg-light text-dark border">${spaceMap[space]}</span> | 
          เวลา: <span class="badge bg-light text-dark border">${energyMap[energy]}</span> | 
          เป้าหมาย: <span class="badge bg-light text-dark border">${purposeMap[purpose]}</span>
        `;
      }

      // 1. เรนเดอร์ Best Match Spotlight (#1)
      if (bestMatchSpotlight) {
        bestMatchSpotlight.innerHTML = `
          <div class="card border-warning border-3 bg-gradient p-0 rounded-4 shadow-lg overflow-hidden">
            <div class="bg-warning text-dark px-4 py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span class="fw-bold fs-5">
                <i class="fa-solid fa-crown me-2"></i>อันดับที่ 1: สายพันธุ์ที่เหมาะสมกับคุณที่สุด (Best Match)
              </span>
              <span class="badge bg-dark text-warning fs-6 px-3 py-2 rounded-pill">
                ความเหมาะสม ${best.score}%
              </span>
            </div>
            
            <div class="card-body p-4 p-md-5">
              <div class="row g-4 align-items-center">
                <div class="col-md-5 text-center">
                  <div class="position-relative overflow-hidden rounded-4 shadow-sm" style="max-height: 280px;">
                    <img src="${best.image}" alt="${best.nameTh}" class="img-fluid w-100 h-100 object-fit-cover" onerror="this.src='images/breeds/default.svg'">
                  </div>
                </div>

                <div class="col-md-7">
                  <div class="d-flex flex-wrap gap-2 mb-2">
                    <span class="badge ${getSizeBadgeClass(best.size)} fs-6">${best.sizeName}</span>
                    <span class="badge bg-light text-dark border fs-6">${best.groupName}</span>
                    <span class="badge bg-light text-secondary border fs-6"><i class="fa-regular fa-clock me-1"></i>อายุขัย ${best.lifespan}</span>
                  </div>

                  <h2 class="fw-bold text-dark mb-1">${best.nameTh}</h2>
                  <div class="text-secondary mb-3 fst-italic fs-5">(${best.nameEn})</div>

                  <p class="text-dark mb-3">${best.desc}</p>

                  <!-- แถบวัดความเหมาะสม -->
                  <div class="mb-3">
                    <div class="d-flex justify-content-between small fw-bold mb-1">
                      <span>คะแนนความเข้ากันได้ตามไลฟ์สไตล์</span>
                      <span class="text-warning">${best.score}% Match</span>
                    </div>
                    <div class="progress" style="height: 12px;">
                      <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${best.score}%;"></div>
                    </div>
                  </div>

                  <!-- เหตุผลที่เข้ากันได้ -->
                  <div class="bg-light p-3 rounded-3 mb-3 border">
                    <div class="fw-bold text-dark small mb-2"><i class="fa-solid fa-circle-check text-success me-2"></i>ทำไมสายพันธุ์นี้ถึงตรงใจคุณ:</div>
                    <ul class="list-unstyled mb-0 small text-secondary d-flex flex-column gap-1">
                      ${best.reasons.map(r => `<li><i class="fa-solid fa-check text-warning me-2"></i>${r}</li>`).join('')}
                    </ul>
                  </div>

                  <!-- ปุ่มลิงก์รายละเอียด -->
                  <div class="d-flex flex-wrap gap-2">
                    <a href="breeds.html?search=${encodeURIComponent(best.nameTh)}" class="btn btn-warning px-3 shadow-sm">
                      <i class="fa-solid fa-dog me-1"></i> ศึกษาข้อมูลสายพันธุ์นี้เพิ่มเติม
                    </a>
                    <a href="groups.html?group=${best.group}" class="btn btn-outline-dark px-3">
                      <i class="fa-solid fa-layer-group me-1"></i> ดูกลุ่ม ${best.groupName}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // 2. เรนเดอร์ Runner-Up Matches (#2 และ #3)
      if (runnerUpMatchesRow) {
        runnerUpMatchesRow.innerHTML = '';
        runnerUps.forEach((dog, idx) => {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.innerHTML = `
            <div class="card custom-card h-100 p-3 border-2 shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-light text-dark border fw-bold">
                  <i class="fa-solid fa-medal text-warning me-1"></i>อันดับที่ ${idx + 2}
                </span>
                <span class="badge bg-warning-subtle text-dark border fw-bold">ความเหมาะสม ${dog.score}%</span>
              </div>
              <div class="row g-3 align-items-center mb-3">
                <div class="col-4">
                  <img src="${dog.image}" class="rounded-3 img-fluid object-fit-cover w-100" style="height: 95px;" alt="${dog.nameTh}" onerror="this.src='images/breeds/default.svg'">
                </div>
                <div class="col-8">
                  <h5 class="fw-bold text-dark mb-0">${dog.nameTh}</h5>
                  <div class="small text-secondary mb-1">(${dog.nameEn})</div>
                  <div class="d-flex flex-wrap gap-1">
                    <span class="badge ${getSizeBadgeClass(dog.size)}">${dog.sizeName}</span>
                    <span class="badge bg-light text-dark border">${dog.groupName}</span>
                  </div>
                </div>
              </div>
              <p class="small text-muted mb-3">${dog.desc}</p>
              <div class="bg-light p-2 rounded-2 small text-secondary mb-3">
                <i class="fa-solid fa-circle-check text-success me-1"></i> ${dog.reasons[0] || 'เข้ากับไลฟ์สไตล์ของคุณได้ดี'}
              </div>
              <div class="mt-auto">
                <a href="breeds.html?search=${encodeURIComponent(dog.nameTh)}" class="btn btn-sm btn-outline-dark w-100">
                  <i class="fa-solid fa-arrow-right me-1"></i> ดูข้อมูลในรวมสายพันธุ์
                </a>
              </div>
            </div>
          `;
          runnerUpMatchesRow.appendChild(col);
        });
      }

      // 3. เรนเดอร์ Other Compatible Matches (อันดับ 4 - 9)
      if (otherMatchesRow) {
        otherMatchesRow.innerHTML = '';
        otherMatches.forEach(dog => {
          const col = document.createElement('div');
          col.className = 'col-md-6 col-lg-4';
          col.innerHTML = `
            <div class="card p-3 border bg-white h-100 shadow-sm">
              <div class="d-flex align-items-center gap-3">
                <img src="${dog.image}" class="rounded-circle object-fit-cover" style="width: 55px; height: 55px;" alt="${dog.nameTh}">
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold mb-0">${dog.nameTh}</h6>
                    <span class="badge bg-light text-dark border">${dog.score}%</span>
                  </div>
                  <div class="small text-secondary mb-1">${dog.nameEn}</div>
                  <span class="badge ${getSizeBadgeClass(dog.size)} small">${dog.sizeName}</span>
                </div>
              </div>
              <div class="mt-2 pt-2 border-top text-end">
                <a href="breeds.html?search=${encodeURIComponent(dog.nameTh)}" class="small text-decoration-none text-warning fw-semibold">
                  รายละเอียด <i class="fa-solid fa-chevron-right ms-1"></i>
                </a>
              </div>
            </div>
          `;
          otherMatchesRow.appendChild(col);
        });
      }

      // แสดงผลลัพธ์และเลื่อนหน้าจอ
      if (quizResultSection) {
        quizResultSection.classList.remove('d-none');
        quizResultSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // ปุ่มรีเซ็ตการทดสอบ
    function handleQuizReset() {
      if (quizForm) quizForm.reset();
      if (quizResultSection) quizResultSection.classList.add('d-none');
      const formCard = document.getElementById('quizFormCard');
      if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
    }

    if (resetQuizBtn) resetQuizBtn.addEventListener('click', handleQuizReset);
    if (formResetQuickBtn) formResetQuickBtn.addEventListener('click', handleQuizReset);
  }

  // --------------------------------------------------------------------------
  // 3. ระบบตัวกรองสายพันธุ์สุนัขและเปลี่ยนหน้า (breeds.html)
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById('breedSearchInput');
  const sizeSelect = document.getElementById('sizeFilterSelect');
  const sizeFilterBtns = document.querySelectorAll('.size-filter-btn');
  const groupSelect = document.getElementById('groupFilterSelect');
  const groupFilterBtns = document.querySelectorAll('.group-filter-btn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const currentPageBadge = document.getElementById('currentPageBadge');
  const currentPageName = document.getElementById('currentPageName');
  const paginationWrapper = document.getElementById('breedsPaginationWrapper');
  const breedWrappers = document.querySelectorAll('.col-breed-wrapper');
  const sizeHeaders = document.querySelectorAll('.size-category-header');

  let currentActivePage = 1;
  let isAllView = false;
  let currentGroupFilter = 'all';

  // ฟังก์ชันซิงก์สถานะปุ่มตัวกรองขนาดและ Dropdown
  function syncSizeUI(selectedSize) {
    if (sizeSelect) {
      sizeSelect.value = selectedSize;
    }
    sizeFilterBtns.forEach(btn => {
      if (btn.getAttribute('data-size') === selectedSize) {
        btn.classList.add('active', 'btn-warning');
        btn.classList.remove('btn-outline-warning');
      } else {
        btn.classList.remove('active', 'btn-warning');
        btn.classList.add('btn-outline-warning');
      }
    });
  }

  // ฟังก์ชันซิงก์สถานะปุ่มตัวกรองกลุ่มและ Dropdown
  function syncGroupUI(selectedGroup) {
    currentGroupFilter = selectedGroup;
    if (groupSelect) {
      groupSelect.value = selectedGroup;
    }
    groupFilterBtns.forEach(btn => {
      if (btn.getAttribute('data-group') === selectedGroup) {
        btn.classList.add('active', 'btn-dark', 'text-white');
        btn.classList.remove('btn-outline-secondary');
      } else {
        btn.classList.remove('active', 'btn-dark', 'text-white');
        btn.classList.add('btn-outline-secondary');
      }
    });
  }

  // ฟังก์ชันเลื่อนหน้าจอไปยังส่วนรายการสุนัขอย่างนุ่มนวล
  function scrollToBreedList() {
    const container = document.getElementById('breedListContainer');
    if (container) {
      const yOffset = -90;
      const y = container.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  // ฟังก์ชันแสดงสุนัขทุกตัว (ครบ 30 สายพันธุ์)
  function showAllBreeds(shouldScroll = true) {
    isAllView = true;
    currentGroupFilter = 'all';

    // 1. แสดงการ์ดสุนัขทั้ง 30 ตัว
    breedWrappers.forEach(wrapper => {
      wrapper.style.display = 'block';
    });

    // 2. แสดงหัวข้อทั้ง 3 หมวดหมู่
    sizeHeaders.forEach(header => {
      header.style.display = 'block';
    });

    // 3. ปรับ UI ตัวบ่งชี้หน้าและการควบคุม
    if (paginationWrapper) paginationWrapper.classList.remove('d-none');
    if (currentPageBadge) currentPageBadge.textContent = 'แสดงทั้งหมด';
    if (currentPageName) currentPageName.textContent = 'ครบทั้ง 30 สายพันธุ์ (ทุกขนาด & ทุกกลุ่ม)';

    if (prevPageBtn) prevPageBtn.disabled = true;
    if (nextPageBtn) nextPageBtn.disabled = false;

    syncSizeUI('all');
    syncGroupUI('all');

    if (shouldScroll) scrollToBreedList();
  }

  // ฟังก์ชันสลับหน้าเฉพาะขนาด (หน้า 1 = เล็ก, หน้า 2 = กลาง, หน้า 3 = ใหญ่)
  function switchBreedPage(pageNumber, shouldScroll = true) {
    isAllView = false;
    currentGroupFilter = 'all';
    currentActivePage = pageNumber;
    const totalPages = 3;

    // 1. ซ่อน/แสดงการ์ดตามหมายเลขหน้า
    breedWrappers.forEach(wrapper => {
      const cardPage = wrapper.getAttribute('data-page');
      wrapper.style.display = (cardPage === String(pageNumber)) ? 'block' : 'none';
    });

    // 2. แสดงเฉพาะหัวข้อของหน้านั้น
    sizeHeaders.forEach(header => {
      header.style.display = 'none';
    });

    if (pageNumber === 1) {
      const smallHeader = document.getElementById('smallCategoryHeader');
      if (smallHeader) smallHeader.style.display = 'block';
      if (currentPageBadge) currentPageBadge.textContent = 'หน้า 1 / 3';
      if (currentPageName) currentPageName.textContent = 'สุนัขพันธุ์เล็ก (10 สายพันธุ์)';
      syncSizeUI('small');
    } else if (pageNumber === 2) {
      const mediumHeader = document.getElementById('mediumCategoryHeader');
      if (mediumHeader) mediumHeader.style.display = 'block';
      if (currentPageBadge) currentPageBadge.textContent = 'หน้า 2 / 3';
      if (currentPageName) currentPageName.textContent = 'สุนัขพันธุ์กลาง (10 สายพันธุ์)';
      syncSizeUI('medium');
    } else if (pageNumber === 3) {
      const largeHeader = document.getElementById('largeCategoryHeader');
      if (largeHeader) largeHeader.style.display = 'block';
      if (currentPageBadge) currentPageBadge.textContent = 'หน้า 3 / 3';
      if (currentPageName) currentPageName.textContent = 'สุนัขพันธุ์ใหญ่ (10 สายพันธุ์)';
      syncSizeUI('large');
    }

    if (paginationWrapper) paginationWrapper.classList.remove('d-none');
    if (prevPageBtn) prevPageBtn.disabled = (pageNumber <= 1);
    if (nextPageBtn) nextPageBtn.disabled = (pageNumber >= totalPages);

    syncGroupUI('all');

    if (shouldScroll) scrollToBreedList();
  }

  // ฟังก์ชันกรองตามขนาด
  function filterBySize(size) {
    if (size === 'all') {
      showAllBreeds(true);
    } else if (size === 'small') {
      switchBreedPage(1, true);
    } else if (size === 'medium') {
      switchBreedPage(2, true);
    } else if (size === 'large') {
      switchBreedPage(3, true);
    }
  }

  // ฟังก์ชันกรองตาม 7 กลุ่มสายพันธุ์สากล (Canine Groups)
  function filterByGroup(group, shouldScroll = true) {
    if (group === 'all') {
      showAllBreeds(shouldScroll);
      return;
    }

    isAllView = false;
    currentGroupFilter = group;
    syncGroupUI(group);

    // รีเซ็ตปุ่มเลือกขนาดเป็นปกติ
    sizeFilterBtns.forEach(btn => {
      btn.classList.remove('active', 'btn-warning');
      btn.classList.add('btn-outline-warning');
    });
    if (sizeSelect) sizeSelect.value = 'all';

    // ซ่อนหัวข้อหมวดหมู่ขนาด เพื่อแสดงเป็นกลุ่มสายพันธุ์แทน
    sizeHeaders.forEach(header => {
      header.style.display = 'none';
    });

    // กรองการ์ดสุนัข
    let matchCount = 0;
    breedWrappers.forEach(wrapper => {
      const cardGroup = wrapper.getAttribute('data-group');
      if (cardGroup === group) {
        wrapper.style.display = 'block';
        matchCount++;
      } else {
        wrapper.style.display = 'none';
      }
    });

    // อัปเดตแถบระบุหน้า
    const info = canineGroupData[group];
    const groupTitle = info ? info.name : group.toUpperCase();
    if (currentPageBadge) currentPageBadge.textContent = `กลุ่ม: ${info ? info.shortName : group}`;
    if (currentPageName) currentPageName.textContent = `${groupTitle} (พบ ${matchCount} สายพันธุ์)`;

    // ซ่อนปุ่มเปลี่ยนหน้าขนาด เนื่องจากแสดงผลสุนัขในกลุ่มทั้งหมดในคราวเดียว
    if (paginationWrapper) {
      paginationWrapper.classList.add('d-none');
    }

    if (shouldScroll) scrollToBreedList();
  }

  // จัดการ Event ตัวกรองขนาด
  sizeFilterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const selectedSize = this.getAttribute('data-size');
      filterBySize(selectedSize);
    });
  });

  if (sizeSelect) {
    sizeSelect.addEventListener('change', function () {
      filterBySize(this.value);
    });
  }

  // จัดการ Event ตัวกรองกลุ่มสายพันธุ์
  groupFilterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const selectedGroup = this.getAttribute('data-group');
      filterByGroup(selectedGroup);
    });
  });

  if (groupSelect) {
    groupSelect.addEventListener('change', function () {
      filterByGroup(this.value);
    });
  }

  // ปุ่มเปลี่ยนหน้า: "หน้าก่อนหน้า" และ "หน้าถัดไป"
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isAllView) {
        switchBreedPage(3, true);
      } else if (currentActivePage > 1) {
        switchBreedPage(currentActivePage - 1, true);
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isAllView) {
        switchBreedPage(2, true);
      } else if (currentActivePage < 3) {
        switchBreedPage(currentActivePage + 1, true);
      }
    });
  }

  // ระบบค้นหาสายพันธุ์แบบ Real-time (Live Search)
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const breedCards = document.querySelectorAll('.breed-item-card');

      if (searchTerm.length > 0) {
        if (paginationWrapper) paginationWrapper.classList.add('d-none');
        sizeHeaders.forEach(h => h.style.display = 'none');

        let searchCount = 0;
        breedCards.forEach(card => {
          const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
          const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
          const wrapper = card.closest('.col-breed-wrapper');

          if (title.includes(searchTerm) || desc.includes(searchTerm)) {
            wrapper.style.display = 'block';
            searchCount++;
          } else {
            wrapper.style.display = 'none';
          }
        });

        if (currentPageBadge) currentPageBadge.textContent = 'ผลการค้นหา';
        if (currentPageName) currentPageName.textContent = `พบ ${searchCount} สายพันธุ์ที่ตรงกับ "${e.target.value}"`;
      } else {
        if (currentGroupFilter !== 'all') {
          filterByGroup(currentGroupFilter, false);
        } else if (isAllView) {
          showAllBreeds(false);
        } else {
          switchBreedPage(currentActivePage, false);
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. ระบบ Interactive Explorer บนหน้า groups.html
  // --------------------------------------------------------------------------
  const explorerBtns = document.querySelectorAll('.explorer-btn');
  const explorerCards = document.querySelectorAll('.explorer-card-wrapper');
  const explorerActiveTitle = document.getElementById('explorerActiveGroupTitle');
  const explorerActiveDesc = document.getElementById('explorerActiveGroupDesc');
  const explorerActiveCount = document.getElementById('explorerActiveCount');
  const groupJumpBtns = document.querySelectorAll('.group-jump-btn');

  function filterExplorerSection(group, shouldScroll = false) {
    // 1. ปรับสถานะปุ่มตัวเลือก
    explorerBtns.forEach(btn => {
      const btnGroup = btn.getAttribute('data-group');
      if (btnGroup === group) {
        btn.classList.add('active', 'btn-warning', 'shadow-sm');
        btn.classList.remove('btn-outline-warning');
      } else {
        btn.classList.remove('active', 'btn-warning', 'shadow-sm');
        btn.classList.add('btn-outline-warning');
      }
    });

    // 2. แสดง/ซ่อนการ์ดสุนัข
    let count = 0;
    explorerCards.forEach(card => {
      const cardGroup = card.getAttribute('data-group');
      if (group === 'all' || cardGroup === group) {
        card.style.display = 'block';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    // 3. ปรับข้อความสรุป
    if (group === 'all') {
      if (explorerActiveTitle) explorerActiveTitle.textContent = 'กลุ่มทั้งหมด (All Groups)';
      if (explorerActiveDesc) explorerActiveDesc.textContent = 'แสดงสายพันธุ์สุนัขครบทั้ง 30 สายพันธุ์ จากทุกกลุ่มสากล';
      if (explorerActiveCount) explorerActiveCount.textContent = 'พบ 30 สายพันธุ์';
    } else {
      const info = canineGroupData[group];
      if (info) {
        if (explorerActiveTitle) explorerActiveTitle.textContent = info.name;
        if (explorerActiveDesc) explorerActiveDesc.textContent = info.desc;
        if (explorerActiveCount) explorerActiveCount.textContent = `พบ ${count} สายพันธุ์`;
      }
    }

    // 4. เลื่อนหน้าจอไปยังส่วน Explorer หากต้องการ
    if (shouldScroll) {
      const explorerSection = document.getElementById('groupsExplorer');
      if (explorerSection) {
        const yOffset = -70;
        const y = explorerSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  // Event listener สำหรับปุ่มตัวกรองใน Explorer
  explorerBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const selectedGroup = this.getAttribute('data-group');
      filterExplorerSection(selectedGroup, false);
    });
  });

  // Event listener สำหรับปุ่มกระโดดจากภาพรวม 7 กลุ่มด้านบน
  groupJumpBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetGroup = this.getAttribute('data-target-group');
      filterExplorerSection(targetGroup, true);
    });
  });

  // --------------------------------------------------------------------------
  // 5. ตรวจสอบ URL Query Parameters เมื่อโหลดหน้าเว็บ
  //    (รองรับ ?group=... , ?size=... , ?search=... ระหว่างหน้าต่างๆ)
  // --------------------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const groupParam = urlParams.get('group');
  const sizeParam = urlParams.get('size');
  const searchParam = urlParams.get('search');

  // กรณีอยู่ที่หน้า breeds.html
  if (breedWrappers.length > 0) {
    if (groupParam && canineGroupData[groupParam]) {
      filterByGroup(groupParam, false);
    } else if (sizeParam) {
      filterBySize(sizeParam);
    } else if (searchParam && searchInput) {
      searchInput.value = searchParam;
      searchInput.dispatchEvent(new Event('input'));
    } else {
      // ค่าเริ่มต้น: แสดงหน้า 1 (พันธุ์เล็ก)
      switchBreedPage(1, false);
    }
  }

  // กรณีอยู่ที่หน้า groups.html
  if (explorerCards.length > 0) {
    if (groupParam && canineGroupData[groupParam]) {
      filterExplorerSection(groupParam, true);
    } else {
      filterExplorerSection('all', false);
    }
  }
});
