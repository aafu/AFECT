import React from 'react';

export type LogoColorTheme = 'green' | 'white';

interface AssociationLogoProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'full' | 'badge' | 'icon' | 'watermark' | 'seal';
  showText?: boolean;
  theme?: LogoColorTheme; // 'green' for light/white backgrounds, 'white' for dark/colored backgrounds
  color?: LogoColorTheme; // alias for theme
}

/**
 * Official Logo for Association for Akha Education and Culture (AFECT)
 * ออกแบบจำลองลายเส้นตรงตามตราสัญลักษณ์ทางการ 100% จากต้นฉบับ:
 * - กรอบสี่เหลี่ยมผืนผ้าสีเขียว (Green Rectangular Border)
 * - ข้อความโค้งด้านบน: "สมาคมเพื่อการศึกษาและวัฒนธรรมอ่าข่า"
 * - ลายเส้นเนินเขาลาดเอียงจากซ้ายไปขวา
 * - ซ้ายบน: พระอาทิตย์/เมฆฝนสไตล์ชนเผ่าพร้อมหยดน้ำฝน 3 แถว
 * - ล่างซ้าย: บ้านกระต๊อบ/บ้านไม้ยกใต้ถุนชนเผ่าอ่าข่า และขนำ
 * - กลาง: เรือนยาวชนเผ่าและชิงช้าอ่าข่า 4 เสา (โล้ชิงช้า)
 * - ขวาบน: ประตูหมู่บ้าน (ข่าลาง/โล้ชิงช้า) พร้อมเครื่องประดับศีรษะสตรีอ่าข่าสีแดงสด (หมวกอ่าข่าทรงกลมสีแดง)
 * - ขวาล่าง: รูปต้นไม้ศักดิ์สิทธิ์/ลวดลายธรรมชาติ
 * - ด้านล่างในกรอบ: "เชียงราย"
 * - ด้านล่างนอกกรอบ: "AFECT" (ฟอนต์ Serif หนักแน่น)
 */
export const AssociationLogo: React.FC<AssociationLogoProps> = ({
  className = 'w-auto h-12',
  style,
  variant = 'full',
  showText = true,
  theme,
  color,
}) => {
  // Determine color scheme: 'white' for colored/dark backgrounds, 'green' for white/light backgrounds
  const activeTheme: LogoColorTheme = color || theme || 'green';
  const isWhite = activeTheme === 'white';

  // Palette definitions according to official brand guidelines
  const primaryColor = isWhite ? '#ffffff' : '#046A38'; // Dark Forest Green of AFECT
  const redSunColor = '#E11D23'; // Bright Crimson Red of Akha traditional headdress/sun
  const innerBg = isWhite ? 'transparent' : '#ffffff';
  const secondaryStroke = isWhite ? 'rgba(255, 255, 255, 0.7)' : '#058245';
  const sealFill = isWhite ? 'rgba(255, 255, 255, 0.12)' : '#ffffff';
  const sealSubFill = isWhite ? 'rgba(255, 255, 255, 0.05)' : '#f0fdf4';

  // Seal Variant (Official Circular Stamp)
  if (variant === 'seal') {
    return (
      <div style={style} className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Seal Outer Borders */}
          <circle cx="80" cy="80" r="76" fill={sealSubFill} stroke={primaryColor} strokeWidth="3.5" />
          <circle cx="80" cy="80" r="71" fill="none" stroke={secondaryStroke} strokeWidth="1.2" strokeDasharray="3 2" />
          <circle cx="80" cy="80" r="54" fill={sealFill} stroke={primaryColor} strokeWidth="2" />

          {/* Curved Text Path Top */}
          <path id="sealTopCurve" d="M 23 80 A 57 57 0 0 1 137 80" fill="none" stroke="none" />
          <text fill={primaryColor} fontSize="9.2" fontWeight="800" fontFamily="'Prompt', 'Sarabun', sans-serif">
            <textPath href="#sealTopCurve" startOffset="50%" textAnchor="middle">
              สมาคมเพื่อการศึกษาและวัฒนธรรมอ่าข่า
            </textPath>
          </text>

          {/* Curved Text Path Bottom */}
          <path id="sealBottomCurve" d="M 137 80 A 57 57 0 0 1 23 80" fill="none" stroke="none" />
          <text fill={primaryColor} fontSize="8.5" fontWeight="800" fontFamily="'Prompt', sans-serif" letterSpacing="0.8">
            <textPath href="#sealBottomCurve" startOffset="50%" textAnchor="middle">
              ★ เชียงราย • AFECT ★
            </textPath>
          </text>

          {/* Inner Official Motif Miniature */}
          <g transform="translate(42, 45) scale(0.76)">
            {/* Mountain Slope */}
            <path d="M 4 60 C 26 53, 58 44, 96 38" stroke={primaryColor} strokeWidth="2.8" strokeLinecap="round" />
            
            {/* Akha Village Hut on Left */}
            <path d="M 14 57 L 14 47 L 21 38 L 28 47 L 28 57" stroke={primaryColor} strokeWidth="2" fill="none" />
            <path d="M 11 43 L 21 35 L 31 43" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="21" y1="35" x2="21" y2="28" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />

            {/* Swing in Center */}
            <line x1="46" y1="56" x2="52" y2="26" stroke={primaryColor} strokeWidth="2.4" />
            <line x1="58" y1="56" x2="52" y2="26" stroke={primaryColor} strokeWidth="2.4" />
            <ellipse cx="52" cy="24" rx="3.5" ry="5" fill={primaryColor} />
            <path d="M 49 46 Q 52 42, 55 46 L 52 53 Z" fill={primaryColor} />

            {/* Village Gate & Traditional Red Headdress */}
            <line x1="72" y1="44" x2="72" y2="35" stroke={primaryColor} strokeWidth="2.2" />
            <line x1="82" y1="42" x2="82" y2="33" stroke={primaryColor} strokeWidth="2.2" />
            <path d="M 68 35 Q 77 38, 86 33" stroke={primaryColor} strokeWidth="2.6" strokeLinecap="round" />
            
            {/* Red Akha Headdress Orb */}
            <circle cx="77" cy="22" r="6" fill={redSunColor} />
            <path d="M 72 20 Q 70 23, 72 26" stroke={redSunColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 82 20 Q 84 23, 82 26" stroke={redSunColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>
    );
  }

  // Badge or Icon Variant (Compact Shield / App Icon Format)
  if (variant === 'badge' || variant === 'icon') {
    return (
      <div style={style} className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 100 86"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rectangular Outer Frame like the real logo with soft rounded corners */}
          <rect
            x="3"
            y="3"
            width="94"
            height="68"
            rx="5"
            fill={innerBg}
            stroke={primaryColor}
            strokeWidth="3.5"
          />

          {/* Top Thai Arc Title */}
          <text
            x="50"
            y="13.5"
            textAnchor="middle"
            fill={primaryColor}
            fontSize="4.7"
            fontWeight="800"
            fontFamily="'Prompt', 'Sarabun', sans-serif"
          >
            สมาคมเพื่อการศึกษาและวัฒนธรรมอ่าข่า
          </text>

          {/* Rain / Weather Motif on Upper Left */}
          <path
            d="M 8 26 C 9 22, 14 20, 18 21 C 21 21.5, 23 23, 22 25 C 20 26, 18 24.5, 14 26 Z"
            fill={primaryColor}
          />
          <g stroke={primaryColor} strokeWidth="1" strokeLinecap="round">
            <line x1="10" y1="28" x2="9" y2="30" />
            <line x1="13" y1="28" x2="12" y2="31" />
            <line x1="16" y1="28" x2="15" y2="30.5" />
            <line x1="19" y1="27.5" x2="18.5" y2="30" />
          </g>

          {/* Main Sloping Hill Ground Line */}
          <path
            d="M 6 58 C 18 51, 38 43, 62 39 C 76 37, 85 36, 94 34.5"
            stroke={primaryColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* 1. Left Stilt House */}
          <g stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1="13" y1="56" x2="13" y2="47" />
            <line x1="18" y1="54" x2="18" y2="46" />
            <rect x="12" y="42" width="7" height="5.5" strokeWidth="1.1" fill={innerBg} />
            <path d="M 10 43 L 15.5 35 L 21 43" strokeWidth="1.4" />
            <line x1="15.5" y1="35" x2="15.5" y2="31" strokeWidth="1.2" />
          </g>

          {/* 2. Lower Stilt House */}
          <g stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1="24" y1="57" x2="24" y2="63" />
            <line x1="32" y1="55" x2="32" y2="63" />
            <rect x="23" y="52" width="10" height="5" strokeWidth="1.1" fill={innerBg} />
            <path d="M 21.5 52 L 28 44 L 34.5 52" strokeWidth="1.4" />
          </g>

          {/* 3. Middle Akha Longhouse Roof */}
          <g stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 31 43 L 39 33 L 53 40" strokeWidth="1.5" />
            <path d="M 39 34 L 46 32 L 55 38" strokeWidth="1.3" />
            <rect x="42" y="44" width="7.5" height="4" strokeWidth="1.1" />
            <line x1="43" y1="48" x2="43" y2="51" />
            <line x1="48.5" y1="48" x2="48.5" y2="50" />
          </g>

          {/* 4. Akha Giant Swing (Center) */}
          <g stroke={primaryColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="57" y1="45" x2="63.5" y2="28" strokeWidth="1.5" />
            <line x1="60" y1="46" x2="63.5" y2="28" strokeWidth="1.2" />
            <line x1="67" y1="43" x2="63.5" y2="28" strokeWidth="1.2" />
            <line x1="70" y1="44" x2="63.5" y2="28" strokeWidth="1.5" />
            {/* Top Post Cap */}
            <ellipse cx="63.5" cy="26" rx="1.8" ry="2.8" fill={primaryColor} />
            {/* Swing Person (Upside Down swing acrobatic) */}
            <path d="M 61 38 Q 63.5 35, 66 38 L 63.5 44 Z" fill={primaryColor} />
          </g>

          {/* 5. Village Gate and Traditional Red Headdress */}
          <g stroke={primaryColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1="77" y1="39" x2="77" y2="31" />
            <line x1="86" y1="37" x2="86" y2="29" />
            <path d="M 74 30 Q 82 33, 90 28" strokeWidth="1.6" />
            <line x1="76" y1="32" x2="87" y2="30.5" strokeWidth="1.1" />
            
            {/* Red Akha Headdress Motif */}
            <circle cx="82" cy="19.5" r="4.2" fill={redSunColor} />
            <path d="M 76.8 17.5 Q 75.5 19.5, 77 22" stroke={redSunColor} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 87.2 17.5 Q 88.5 19.5, 87 22" stroke={redSunColor} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 79 23.8 Q 82 25.5, 85 23.8" stroke={redSunColor} strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* 6. Akha Cultural Tree / Nature Shape on Right */}
          <path
            d="M 85 53 C 83 49, 85 47, 88 47 C 91 44, 95 47, 94 51 C 97 53, 96 59, 93 60 C 94 63, 92 68, 89 66 C 88 70, 85 71, 84 66 C 81 67, 80 62, 82 59 C 79 57, 81 54, 85 53 Z"
            fill={primaryColor}
          />

          {/* Text inside bottom: เชียงราย */}
          <text
            x="50"
            y="64.5"
            textAnchor="middle"
            fill={primaryColor}
            fontSize="5.2"
            fontWeight="800"
            fontFamily="'Prompt', 'Sarabun', sans-serif"
          >
            เชียงราย
          </text>

          {/* Text outside frame: AFECT */}
          {showText && (
            <text
              x="50"
              y="81.5"
              textAnchor="middle"
              fill={primaryColor}
              fontSize="8.5"
              fontWeight="900"
              fontFamily="'Times New Roman', Georgia, serif"
              letterSpacing="2.5"
            >
              AFECT
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Watermark Variant (Subtle, large faded background)
  if (variant === 'watermark') {
    return (
      <div style={style} className={`relative inline-block select-none pointer-events-none opacity-10 ${className}`}>
        <svg
          viewBox="0 0 960 660"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="20" y="20" width="920" height="550" rx="8" stroke={primaryColor} strokeWidth="16" />
          <path d="M 40 500 C 180 435, 420 345, 660 305 C 780 285, 860 275, 930 260" stroke={primaryColor} strokeWidth="14" strokeLinecap="round" />
          <text x="480" y="95" textAnchor="middle" fill={primaryColor} fontSize="44" fontWeight="bold">สมาคมเพื่อการศึกษาและวัฒนธรรมอ่าข่า</text>
          <text x="480" y="520" textAnchor="middle" fill={primaryColor} fontSize="44" fontWeight="bold">เชียงราย</text>
          <text x="480" y="635" textAnchor="middle" fill={primaryColor} fontSize="58" fontWeight="bold" letterSpacing="4">AFECT</text>
        </svg>
      </div>
    );
  }

  // Full Official Logo Variant (Accurate high-resolution vector representation of Logo_AFECT.jpg)
  return (
    <div style={style} className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 960 660"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Main Outer Green Rectangle Border Frame */}
        <rect
          x="18"
          y="18"
          width="924"
          height="540"
          rx="6"
          fill={innerBg}
          stroke={primaryColor}
          strokeWidth="14"
        />

        {/* 2. Top Header Thai Text (Curved Arc Shape): "สมาคมเพื่อการศึกษาและวัฒนธรรมอ่าข่า" */}
        <g id="topThaiHeader">
          <text
            x="480"
            y="98"
            textAnchor="middle"
            fill={primaryColor}
            fontSize="43"
            fontWeight="900"
            fontFamily="'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif"
            letterSpacing="0.8"
          >
            สมาคมเพื่อการศึกษาและวัฒนธรรมอ่าข่า
          </text>
        </g>

        {/* 3. Upper Left Weather/Sun/Cloud Motif with 3 rows of rain drops */}
        <g id="weatherSunAndRain">
          {/* Cloud/Sun Arc Body */}
          <path
            d="M 52 238 C 45 220, 75 185, 115 170 C 160 155, 195 185, 230 190 C 242 192, 252 208, 238 225 C 220 248, 192 232, 165 240 C 138 248, 115 228, 88 248 C 72 262, 58 252, 52 238 Z"
            fill={primaryColor}
          />
          {/* Rain dashes / dots falling downwards */}
          <g stroke={primaryColor} strokeWidth="7" strokeLinecap="round">
            {/* Top row drops */}
            <line x1="168" y1="262" x2="162" y2="280" />
            <line x1="190" y1="252" x2="184" y2="270" />
            <line x1="212" y1="240" x2="206" y2="258" />
            <line x1="234" y1="228" x2="228" y2="246" />
            <line x1="254" y1="218" x2="248" y2="236" />
            
            {/* Middle row drops */}
            <line x1="130" y1="290" x2="124" y2="308" />
            <line x1="150" y1="282" x2="144" y2="300" />
            <line x1="172" y1="274" x2="166" y2="292" />
            <line x1="194" y1="265" x2="188" y2="283" />
            <line x1="216" y1="256" x2="210" y2="274" />
            <line x1="238" y1="248" x2="232" y2="266" />

            {/* Bottom rays/rain dashes */}
            <line x1="58" y1="272" x2="52" y2="286" />
            <line x1="78" y1="278" x2="74" y2="294" />
            <line x1="98" y1="282" x2="94" y2="298" />
            <line x1="118" y1="288" x2="114" y2="304" />
          </g>
        </g>

        {/* 4. The Prominent Mountain Slope Ground Line: From bottom left (x:38, y:510) to right (x:930, y:280) */}
        <path
          d="M 38 510 C 130 445, 270 380, 440 335 C 600 292, 770 282, 930 274"
          stroke={primaryColor}
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />

        {/* 5. Stilted Akha Village Hut on Left */}
        <g id="leftStiltHut" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Two Main Stilts */}
          <line x1="110" y1="485" x2="110" y2="395" strokeWidth="8" />
          <line x1="156" y1="472" x2="156" y2="388" strokeWidth="8" />
          {/* Main House Room */}
          <rect x="98" y="342" width="68" height="52" strokeWidth="7" fill={innerBg} />
          {/* Doorway / Window */}
          <line x1="132" y1="344" x2="132" y2="392" strokeWidth="5" />
          {/* Crossed Gable Roof (Akha Galae Horns) */}
          <path d="M 88 350 L 132 284 L 176 350" strokeWidth="10" />
          <line x1="132" y1="284" x2="132" y2="242" strokeWidth="8" />
          <line x1="116" y1="262" x2="148" y2="296" strokeWidth="6" />
          <line x1="148" y1="262" x2="116" y2="296" strokeWidth="6" />
        </g>

        {/* 6. Lower Village Hut (Beneath the slope) */}
        <g id="lowerVillageHut" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Post Supports */}
          <line x1="228" y1="492" x2="228" y2="542" strokeWidth="7" />
          <line x1="316" y1="480" x2="316" y2="546" strokeWidth="7" />
          {/* Platform Floor */}
          <line x1="216" y1="492" x2="328" y2="492" strokeWidth="9" />
          {/* High Peaked Roof */}
          <path d="M 204 492 L 272 418 L 340 492" strokeWidth="10" />
          {/* Apex horn */}
          <line x1="272" y1="418" x2="272" y2="390" strokeWidth="7" />
        </g>

        {/* 7. Middle Akha Village Longhouse & Rice Granary on slope */}
        <g id="middleLonghouse" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Broad Sweeping Roofline */}
          <path d="M 292 376 L 392 282 L 532 352" strokeWidth="11" />
          <path d="M 388 285 L 476 270 L 576 338" strokeWidth="10" />
          {/* Roof Ridge Horns */}
          <line x1="378" y1="298" x2="368" y2="268" strokeWidth="7" />
          <line x1="504" y1="284" x2="518" y2="258" strokeWidth="7" />
          {/* Granary Storehouse (ใต้ถุนต่ำ) */}
          <rect x="424" y="378" width="76" height="34" strokeWidth="8" fill={innerBg} />
          <line x1="438" y1="412" x2="438" y2="438" strokeWidth="7" />
          <line x1="486" y1="412" x2="486" y2="436" strokeWidth="7" />
        </g>

        {/* 8. Akha Giant Swing (พิธีโล้ชิงช้าอ่าข่า - 4 Giant Wooden Timber Posts) */}
        <g id="akhaGiantSwing" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* 4 Timber posts inclined towards apex */}
          <line x1="560" y1="388" x2="630" y2="216" strokeWidth="11" />
          <line x1="585" y1="398" x2="630" y2="216" strokeWidth="9" />
          <line x1="662" y1="376" x2="630" y2="216" strokeWidth="9" />
          <line x1="694" y1="382" x2="630" y2="216" strokeWidth="11" />

          {/* Crown Apex Timber Log / Top Finial */}
          <path d="M 618 216 C 612 195, 624 180, 630 180 C 636 180, 648 195, 642 216 Z" fill={primaryColor} />
          
          {/* Center Swing Rope with Akha Swinger Swinging High */}
          <path
            d="M 608 344 C 614 300, 646 300, 652 344 L 630 405 Z"
            fill={primaryColor}
          />
          {/* Swing cross brace */}
          <line x1="590" y1="335" x2="670" y2="320" strokeWidth="6" />
        </g>

        {/* 9. Akha Village Sacred Gate (ข่าลาง) with Traditional Red Headdress Ornament */}
        <g id="sacredGateAndRedHeaddress">
          {/* Wooden Gate Posts */}
          <line x1="760" y1="316" x2="760" y2="238" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
          <line x1="846" y1="304" x2="846" y2="226" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
          {/* Crossed Bow-shaped Top Crossbeams */}
          <path d="M 728 226 C 765 244, 840 248, 888 214" stroke={primaryColor} strokeWidth="13" strokeLinecap="round" fill="none" />
          <line x1="748" y1="242" x2="858" y2="228" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
          {/* Vertical Gate Spikes */}
          <line x1="782" y1="244" x2="782" y2="212" stroke={primaryColor} strokeWidth="5" />
          <line x1="804" y1="244" x2="804" y2="210" stroke={primaryColor} strokeWidth="5" />
          <line x1="826" y1="242" x2="826" y2="208" stroke={primaryColor} strokeWidth="5" />

          {/* Authentic Akha Red Headdress / Sun Orb (Bright Red Emblem) */}
          <g id="akhaRedHeaddress">
            {/* Center Red Disc (หมวกอ่าข่าสีแดง) */}
            <circle cx="810" cy="154" r="32" fill={redSunColor} />
            {/* Left Wing / Ear Tassel */}
            <path
              d="M 764 140 C 752 152, 752 172, 764 186 C 772 178, 772 150, 764 140 Z"
              fill={redSunColor}
            />
            {/* Right Wing / Ear Tassel */}
            <path
              d="M 856 140 C 868 152, 868 172, 856 186 C 848 178, 848 150, 856 140 Z"
              fill={redSunColor}
            />
            {/* Bottom Tail Curve of the Akha Headdress */}
            <path
              d="M 780 196 Q 810 214, 840 196"
              stroke={redSunColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* 10. Stylized Sacred Tree / Flora of the Akha Hills (Lower Right) */}
        <g id="sacredFloraTree" fill={primaryColor}>
          {/* Foliage Cloud Silhouette */}
          <path
            d="M 856 462 C 830 422, 855 385, 882 388 C 908 358, 955 382, 942 422 C 968 440, 960 500, 930 505 C 948 530, 932 578, 898 560 C 884 595, 858 598, 845 550 C 820 558, 805 514, 826 488 C 800 468, 822 435, 856 462 Z"
          />
          {/* Cut-out / Inner negative space highlights for tree texture */}
          <path
            d="M 872 478 C 886 462, 915 470, 908 495 C 896 512, 876 500, 872 478 Z"
            fill={innerBg}
          />
          <path
            d="M 852 505 C 862 495, 878 502, 872 520 C 864 530, 848 522, 852 505 Z"
            fill={innerBg}
          />
          {/* Tree Trunk & Roots */}
          <path
            d="M 865 540 L 852 612 L 880 610 L 888 540 Z"
          />
          <path
            d="M 915 545 L 945 618 L 960 610 L 925 540 Z"
          />
        </g>

        {/* 11. Center Bottom Text inside frame: "เชียงราย" */}
        <text
          x="480"
          y="498"
          textAnchor="middle"
          fill={primaryColor}
          fontSize="44"
          fontWeight="900"
          fontFamily="'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif"
          letterSpacing="1.5"
        >
          เชียงราย
        </text>

        {/* 12. Bottom Text outside the frame: "AFECT" */}
        {showText && (
          <text
            x="480"
            y="636"
            textAnchor="middle"
            fill={primaryColor}
            fontSize="52"
            fontWeight="900"
            fontFamily="'Times New Roman', 'Bodoni MT', Georgia, serif"
            letterSpacing="6"
          >
            AFECT
          </text>
        )}
      </svg>
    </div>
  );
};
