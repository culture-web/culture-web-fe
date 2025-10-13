import { Typography, Flex, Image, Button } from 'antd';
import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import { useStyleToken } from 'themeStyles';
import { useState } from 'react';

const { Title, Text } = Typography;

// To do: Use SVG with custom path or polygon tomake the border more precise/ CSS Clip-Path

function OrnamentsPage() {
    /*  const ornaments = [
    {
      id: 'headdress',
      name: 'Kireetam',
      description: 'An elaborate and ornate headgear unique to Kathakali Pacha characters.',
      style: { top: '3%', left: '34%', width: '32%', height: '22%' },
    },
  ]; */

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 1000, 
        margin: '40px auto',
        background: 'transparent',
      }}
    >
      <img
        src={pachaImage} 
        alt="Pacha Kathakali Character"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 960 1280" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 420.2 245.2 L 372.2 259.2 L 342.2 289.2 L 317.2 334.2 L 316.2 385.2 L 336.2 436.2 L 371.2 469.2 L 391.2 445.2 L 452.2 429.2 L 479.2 436.2 L 491.2 468.2 L 519.2 457.2 L 548.2 412.2 L 560.2 371.2 L 548.2 321.2 L 516.2 273.2 L 466.2 249.2 L 415.2 244.8 Z"
          fill="transparent"
          stroke={hovered === 'headdress' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('headdress')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

                {/* Earring left path */}
        <path
          d="M 374.2 425.0 L 361.2 438.0 L 363.2 451.0 L 375.2 460.0 L 387.2 458.0 L 391.2 431.0 L 374.2 424.0 Z"
          fill="transparent"
          stroke={hovered === 'thoda' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('thoda')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        {/* Earring right path */}
        <path
          d="M 480.2 422.6 L 496.2 418.6 L 509.2 426.6 L 509.2 441.6 L 499.2 451.6 L 483.2 448.6 L 479.2 423.6 Z"
          fill="transparent"
          stroke={hovered === 'thoda' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('thoda')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 377.2 472.8 L 369.2 480.8 L 369.2 491.8 L 376.2 499.8 L 389.2 496.8 L 396.2 485.8 L 392.2 476.8 L 380.2 471.8 Z"
          fill="transparent"
          stroke={hovered === 'chevippuvu' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('chevippuvu')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 491.2 464.0 L 481.2 470.8 L 479.2 480.8 L 484.2 488.8 L 494.2 492.8 L 504.2 487.8 L 508.2 477.8 L 504.2 466.8 L 491.2 461.8 Z"
          fill="transparent"
          stroke={hovered === 'chevippuvu' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('chevippuvu')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 398.2 492.0 L 382.2 498.0 L 370.2 504.0 L 366.2 512.0 L 369.2 519.0 L 382.2 525.0 L 398.2 528.0 L 421.2 530.0 L 471.2 528.0 L 506.2 516.0 L 513.2 508.0 L 509.2 500.0 L 478.2 487.0 L 475.2 511.0 L 468.2 519.0 L 440.2 522.0 L 402.2 517.0 L 397.2 491.0 Z"
          fill="transparent"
          stroke={hovered === 'chutti' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('chutti')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 404.2 538.2 L 403.2 545.2 L 424.2 554.2 L 443.2 555.2 L 471.2 548.2 L 472.2 540.2 L 455.2 545.2 L 437.2 548.2 L 419.2 545.2 L 404.2 537.2 Z"
          fill="transparent"
          stroke={hovered === 'Kazhuthu nada' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Kazhuthu nada')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 401.2 543.8 L 391.2 590.8 L 388.2 663.8 L 392.2 675.8 L 406.2 686.8 L 398.2 698.8 L 404.2 711.8 L 415.2 713.8 L 425.2 705.8 L 423.2 693.8 L 438.2 683.8 L 456.2 643.8 L 463.2 623.8 L 471.2 547.8 L 446.2 555.8 L 424.2 553.8 L 401.2 542.8 Z"
          fill="transparent"
          stroke={hovered === 'Kazhuttaram' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Kazhuttaram')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 258.2 559.6 L 253.2 577.6 L 273.2 576.6 L 289.2 586.6 L 299.2 580.6 L 278.2 556.6 L 257.2 561.0 Z"
          fill="transparent"
          stroke={hovered === 'Paruttikkaimani' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Paruttikkaimani')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 567.2 609.8 L 567.2 622.8 L 612.2 614.8 L 612.2 625.8 L 625.2 604.8 L 619.2 596.8 L 579.2 599.8 L 567.2 607.8 Z"
          fill="transparent"
          stroke={hovered === 'Paruttikkaimani' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Paruttikkaimani')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 282.2 558.8 L 295.2 573.8 L 337.2 541.8 L 346.2 540.8 L 336.2 531.8 L 326.2 539.8 L 306.2 544.8 L 284.2 560.8 Z"
          fill="transparent"
          stroke={hovered === 'Toolputtu' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Toolputtu')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 546.2 556.0 L 571.2 601.0 L 601.2 598.0 L 577.2 567.0 L 559.2 553.0 L 546.2 555.0 Z"
          fill="transparent"
          stroke={hovered === 'Toolputtu' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Toolputtu')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 359.2 667.2 L 357.2 692.2 L 398.2 708.2 L 398.2 697.2 L 406.2 688.2 L 423.2 688.2 L 426.2 704.2 L 422.2 712.2 L 448.2 708.2 L 482.2 694.2 L 485.2 680.2 L 472.2 671.2 L 445.2 683.2 L 421.2 683.8 L 385.2 679.8 L 362.2 666.8 Z"
          fill="transparent"
          stroke={hovered === 'Kuralaram' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Kuralaram')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />


        <path
          d="M 383.2 542.6 L 338.2 540.6 L 293.2 574.6 L 275.2 634.6 L 270.2 759.6 L 276.2 781.6 L 260.2 811.6 L 248.2 839.6 L 256.2 859.6 L 230.2 906.6 L 225.2 945.6 L 251.2 962.6 L 291.2 961.6 L 300.2 950.6 L 330.2 959.6 L 373.2 946.6 L 384.2 943.6 L 351.2 887.6 L 359.2 818.6 L 348.2 803.6 L 358.2 765.8 L 357.2 679.8 L 366.2 628.8 L 369.2 574.8 L 384.2 542.8 Z"
          fill="transparent"
          stroke={hovered === 'Uttariya' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Uttariya')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 487.2 541.8 L 494.2 799.8 L 493.2 862.8 L 461.2 944.8 L 486.2 968.8 L 534.2 959.8 L 570.2 973.8 L 615.2 999.8 L 671.2 974.8 L 670.2 956.8 L 646.2 929.8 L 613.2 876.8 L 600.2 772.8 L 611.2 765.8 L 593.2 737.8 L 576.2 625.8 L 540.2 559.8 L 517.2 545.8 L 488.2 540.8 Z"
          fill="transparent"
          stroke={hovered === 'Uttariya' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Uttariya')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 81.2 588.0 L 89.2 599.0 L 108.2 608.0 L 96.2 616.0 L 88.2 644.0 L 69.2 645.0 L 74.2 621.0 L 68.2 611.0 L 49.2 603.0 L 68.2 593.0 L 79.2 588.0 Z"
          fill="transparent"
          stroke={hovered === 'Kastakatakam' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Kastakatakam')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />

        <path
          d="M 557.2 664.8 L 573.2 675.8 L 586.2 690.8 L 576.2 716.8 L 595.2 727.8 L 600.2 721.8 L 615.2 717.8 L 622.2 704.8 L 610.2 691.8 L 589.2 673.8 L 589.2 664.8 L 580.2 652.8 L 557.2 659.8 Z"
          fill="transparent"
          stroke={hovered === 'Kastakatakam' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('Kastakatakam')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />
      </svg>

      {hovered === 'headdress' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',     
            left: '88%',    
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Kireetam</strong>
          <div style={{ fontSize: '0.9em' }}>
            An elaborate and ornate headgear unique to Kathakali Pacha characters.
          </div>
        </div>
      )}

      {hovered === 'thoda' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Thoda</strong>
          <div style={{ fontSize: '0.9em' }}>
            -Convex hemisphere decorated in gilt foil, silver beads, plastic jewels and red felt<br />
            -Worn with Kiritam headdress
          </div>
        </div>
      )}

      {hovered === 'chevippuvu' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Chevippuvu</strong>
          <div style={{ fontSize: '0.9em' }}>
            Convex carved wood disc attached to headband of cotton tape
          </div>
        </div>
      )}
      
      {hovered === 'chutti' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Chutti</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      {hovered === 'Kazhuthu nada' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Kazhuthu nada</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      {hovered === 'Kazhuttaram' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Kazhuttaram</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      

      {hovered === 'Paruttikkaimani' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Paruttikkaimani</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      {hovered === 'Toolputtu' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Toolputtu</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      {hovered === 'Kuralaram' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Kuralaram</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      {hovered === 'Uttariya' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Uttariya</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

      {hovered === 'Kastakatakam' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '88%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Kastakatakam</strong>
          <div style={{ fontSize: '0.9em' }}>
            .
          </div>
        </div>
      )}

    </div>
  );
    return (
    <Flex style={{ width: '50%' }}>
      <Image src={pachaImage} alt="pacha" preview={false} />
    </Flex>    
    )
}

export default OrnamentsPage;

