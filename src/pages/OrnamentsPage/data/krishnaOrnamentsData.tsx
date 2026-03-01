import krishnamudi from 'assets/images/kathakali-ornaments/krishnamudi.png';
import kecchamani from 'assets/images/kathakali-ornaments/kecchamani.png';
import chevippuvu from 'assets/images/kathakali-ornaments/chevippuvu.png';
import chutti from 'assets/images/kathakali-ornaments/chutti.png';
import paruttikkaimani from 'assets/images/kathakali-ornaments/paruttikkaimani.png';
import tolputtu from 'assets/images/kathakali-ornaments/tolputtu.png';
import uttariya from 'assets/images/kathakali-ornaments/uttariya.png';
import kastakatakam from 'assets/images/kathakali-ornaments/kastakatakam.png';
import kalases from 'assets/images/kathakali-ornaments/kalases.png';
import pattuval from 'assets/images/kathakali-ornaments/pattuval.png';
import ottanakku from 'assets/images/kathakali-ornaments/ottanakku.png';
import tantappatippu from 'assets/images/kathakali-ornaments/tantappatippu.png';
import chuttituni from 'assets/images/kathakali-ornaments/chuttituni.png';
import type { Ornament } from './types';

const krishnaOrnamentsData: Ornament[] = [
  {
    id: 'krishna mudi',
    name: 'Krishna Mudi',
    pathD: 'M 428.2 113.0 L 546.2 114.0 L 551.2 122.0 L 540.2 123.0 L 523.2 134.0 L 530.2 147.0 L 522.2 155.0 L 525.2 166.0 L 542.2 189.0 L 547.2 207.0 L 548.2 234.0 L 536.2 241.0 L 437.2 234.0 L 431.2 199.0 L 440.2 180.0 L 456.2 160.0 L 455.2 140.0 L 458.2 132.0 L 452.2 123.0 L 427.2 118.0 L 427.2 111.0 Z',
    tooltipPosition: { top: '10%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Headdress (Crown) of Krishna</li>
      </ul>
    ),
    image: krishnamudi,
  },
 {
    id: 'chevippuvu1',
    name: 'Chevippuvu',
    pathD: 'M 427.8 259.4 L 418.8 268.4 L 416.8 279.4 L 427.8 286.4 L 442.8 285.4 L 449.8 275.4 L 447.8 263.4 L 437.8 257.4 L 428.8 258.4 Z',    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Ear Ornaments</li>
        <li>Attached to headband</li>
        <li>Smaller than Thoda</li>
      </ul>
    ),
    image: chevippuvu,
  },
  {
    id: 'chevippuvu2',
    name: 'Chevippuvu',
    pathD: 'M 535.8 265.4 L 548.8 258.4 L 561.8 266.4 L 563.8 281.4 L 554.8 292.4 L 536.8 292.4 L 530.8 279.4 L 535.8 263.4 Z',    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Ear Ornaments</li>
        <li>Attached to headband</li>
        <li>Smaller than Thoda</li>
      </ul>
    ),
    image: chevippuvu,
  },

  {
    id: 'chutti',
    name: 'Chutti',
    pathD: 'M 446.4 278.4 L 441.4 285.4 L 425.4 292.4 L 418.4 309.4 L 426.4 318.4 L 492.4 344.4 L 513.4 342.4 L 551.4 331.4 L 565.4 320.4 L 564.4 306.4 L 537.4 291.4 L 533.4 284.4 L 530.4 310.4 L 516.4 326.4 L 505.4 336.4 L 494.4 335.4 L 454.4 315.4 L 458.4 291.4 L 448.4 277.4 Z',    
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>White facial ridges</li>
        <li>Made from a mixture of rice paste and lime</li>
        <li>Highlights the facial make-up and curcial for distinguishing characters and their personalities</li>
      </ul>
    ),
    image: chutti,
  },
  {
    id: 'Paruttikkaimani1',
    name: 'Paruttikkaimani',
    pathD: 'M 313.8 455.4 L 333.8 456.4 L 350.8 438.4 L 407.8 434.4 L 415.8 408.4 L 365.8 408.4 L 339.8 413.4 L 322.8 426.4 L 312.8 455.4 Z',    
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Men&apos;s Upper Arm Band</li>
        <li>Wooden beads and baubles with gilt foil</li>
        <li>Tied below tolputtu (epaulettes) at bicep with all three strings to outside of arm</li>
      </ul>
    ),
    image: paruttikkaimani,
  },
  {
    id: 'Paruttikkaimani2',
    name: 'Paruttikkaimani',
    pathD: 'M 595.8 423.4 L 612.8 437.4 L 634.8 439.4 L 662.8 436.4 L 668.8 410.4 L 640.8 408.4 L 612.8 412.4 L 594.8 421.4 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Men&apos;s Upper Arm Band</li>
        <li>Wooden beads and baubles with gilt foil</li>
        <li>Tied below tolputtu (epaulettes) at bicep with all three strings to outside of arm</li>
      </ul>
    ),
    image: paruttikkaimani,
  },
  {
    id: 'Tolputtu1',
    name: 'Tolputtu',
    pathD: 'M 367.8 360.4 L 348.8 372.4 L 346.8 414.4 L 387.8 414.4 L 395.8 376.4 L 387.8 362.4 L 368.8 359.4 Z',
    tooltipPosition: { top: '27%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Epaulettes</li>
        <li>6 pieces carved wood</li>
        <li>Cotton cords tied around body & bicep</li>
      </ul>
    ),
    image: tolputtu,
  },
  {
    id: 'Tolputtu2',
    name: 'Tolputtu',
    pathD: 'M 578.8 360.4 L 579.8 378.4 L 604.8 419.4 L 640.8 414.4 L 610.8 365.4 L 593.8 359.4 L 579.8 360.4 Z',
    tooltipPosition: { top: '27%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Epaulettes</li>
        <li>6 pieces carved wood</li>
        <li>Cotton cords tied around body & bicep</li>
      </ul>
    ),
    image: tolputtu,
  },
  {
    id: 'Uttariya',
    name: 'Uttariya',
    pathD: 'M 417.8 326.4 L 413.8 352.4 L 417.8 396.4 L 424.8 417.4 L 414.8 448.4 L 397.8 555.4 L 385.8 609.4 L 362.8 631.4 L 336.8 704.4 L 346.8 714.4 L 362.8 715.4 L 394.8 729.4 L 418.8 723.4 L 416.8 684.4 L 456.8 689.4 L 470.8 740.4 L 499.8 752.4 L 523.8 753.4 L 532.8 740.4 L 535.8 718.4 L 549.8 723.4 L 573.8 718.4 L 589.8 755.4 L 603.8 767.4 L 620.8 770.4 L 662.8 768.4 L 679.8 758.4 L 685.8 740.4 L 624.8 595.4 L 615.8 572.4 L 601.8 488.4 L 582.8 407.4 L 553.8 363.4 L 551.8 338.4 L 542.8 401.4 L 539.8 487.4 L 531.8 625.4 L 537.8 649.4 L 524.8 661.4 L 506.8 643.4 L 492.8 642.4 L 485.8 609.4 L 463.8 532.4 L 463.8 528.4 L 469.8 480.4 L 465.8 463.4 L 465.8 463.4 L 454.8 406.4 L 416.8 327.4 Z',
    tooltipPosition: { top: '42%', left: '93%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Neck streamers/scarves</li>
        <li>White cotton, 36”x78”, tied at center and third marks; striped area at edge tied off with folded/pleated self ruffles and stuffed full at stripes plus smell ball above</li>
      </ul>
    ),
    image: uttariya,
    labelPosition: { x: 600, y: 680 } 
  },

  {
    id: 'Kastakatakam1',
    name: 'Kastakatakam',
    pathD: 'M 439.8 412.4 L 448.8 417.4 L 470.8 436.4 L 470.8 450.4 L 486.8 453.4 L 490.8 438.4 L 497.8 427.4 L 486.8 417.4 L 475.8 407.4 L 472.8 394.4 L 465.8 393.4 L 441.8 409.4 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Wrist decorations</li>
        <li>Green wool tassels, red cord ties</li>
        <li>Tied to wrist below Kalases (bracelet cuffs)</li>
      </ul>
    ),
    image: kastakatakam,
  },
  {
    id: 'Kastakatakam2',
    name: 'Kastakatakam',
    pathD: 'M 585.8 430.4 L 590.8 444.4 L 581.8 463.4 L 598.8 475.4 L 612.8 461.4 L 616.8 437.4 L 588.8 430.4 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Wrist decorations</li>
        <li>Green wool tassels, red cord ties</li>
        <li>Tied to wrist below Kalases (bracelet cuffs)</li>
      </ul>
    ),
    image: kastakatakam,
  },
  {
    id: 'Kalases1',
    name: 'Kalases',
    pathD: 'M 443.8 422.4 L 421.8 448.4 L 457.8 485.4 L 476.8 461.4 L 444.8 421.4 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Bracelet cuffs</li>
        <li>Gilt foil, strings of silver toned beads</li>
      </ul>
    ),
    image: kalases,
  },
  {
    id: 'Kalases2',
    name: 'Kalases',
    pathD: 'M 614.8 437.4 L 620.8 463.4 L 604.8 477.4 L 583.8 475.4 L 611.8 503.4 L 636.8 503.4 L 656.8 484.4 L 662.8 470.4 L 614.8 434.4 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Bracelet cuffs</li>
        <li>Gilt foil, strings of silver toned beads</li>
      </ul>
    ),
    image: kalases,
  },
  {
    id: 'Pattu Val1',
    name: 'Pattu Val',
    pathD: 'M 346.8 556.4 L 281.8 563.4 L 236.8 578.4 L 177.8 608.4 L 124.8 645.4 L 87.8 678.4 L 38.8 785.4 L 36.8 819.4 L 74.8 840.4 L 73.8 813.4 L 93.8 803.4 L 105.8 811.4 L 114.8 809.4 L 108.8 731.4 L 125.8 687.4 L 175.8 628.4 L 246.8 596.4 L 356.8 573.4 L 348.8 554.4 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Side streamers</li>
        <li>Red panne with gold pinstripe, gold brocaded ribbon trims, wool yarn fringe, straight grain cotton saffron binding, red cotton backing</li>
        <li>Worn over Men&apos;s Kathakali Skirt</li>
      </ul>
    ),
    image: pattuval,
    labelPosition: { x: 80, y: 760 } 
  },
  {
    id: 'Pattu Val2',
    name: 'Pattu Val',
    pathD: 'M 610.8 552.4 L 655.8 643.4 L 760.8 863.4 L 844.8 853.4 L 818.8 726.4 L 796.8 667.4 L 730.8 612.4 L 643.8 543.4 L 610.8 550.4 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Side streamers</li>
        <li>Red panne with gold pinstripe, gold brocaded ribbon trims, wool yarn fringe, straight grain cotton saffron binding, red cotton backing</li>
        <li>Worn over Men&apos;s Kathakali Skirt</li>
      </ul>
    ),
    image: pattuval,
  },
  {
    id: 'Ottanakku',
    name: 'Ottanakku',
    pathD: 'M 510.8 770.4 L 507.8 795.4 L 523.8 805.4 L 536.8 792.4 L 534.8 774.4 L 548.8 759.4 L 555.8 724.4 L 549.8 620.4 L 552.8 590.4 L 519.8 597.4 L 488.8 593.4 L 449.8 585.4 L 473.8 715.4 L 497.8 758.4 L 508.8 768.4 Z',
    tooltipPosition: { top: '18%', left: '92%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Apron</li>
        <li>Red wool tassel with wooden bell shaped topper decorated in gilt foil</li>
        <li>Chrome decoration with silver tone beads</li>
        <li>Red cotton cord to tie around waist</li>
      </ul>
    ),
    image: ottanakku,
  },
  {
    id: 'Tantappatippu1',
    name: 'Tantappatippu',
    pathD: 'M 438.8 1128.4 L 443.8 1143.4 L 457.8 1145.4 L 486.8 1133.4 L 486.8 1114.4 L 439.8 1124.4 Z',
    tooltipPosition: { top: '40%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Bell Stays</li>
        <li>Red wool, black cotton faille trim, silver toned plastic bead string, black cotton end caps, heavy cotton/jute tapes</li>
      </ul>
    ),
    image: tantappatippu,
  },
  {
    id: 'Tantappatippu2',
    name: 'Tantappatippu',
    pathD: 'M 528.8 1117.4 L 532.8 1128.4 L 569.8 1146.4 L 588.8 1141.4 L 585.8 1127.4 L 530.8 1115.4 Z',
    tooltipPosition: { top: '50%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Bell Stays</li>
        <li>Red wool, black cotton faille trim, silver toned plastic bead string, black cotton end caps, heavy cotton/jute tapes</li>
      </ul>
    ),
    image: tantappatippu,
  },
  {
    id: 'Chuttituni',
    name: 'Chuttituni',
    pathD: 'M 422.8 257.4 L 457.8 235.4 L 492.8 229.4 L 527.8 235.4 L 543.8 252.4 L 543.8 252.4 L 540.8 263.4 L 535.8 263.4 L 528.8 252.4 L 506.8 251.4 L 498.8 255.4 L 487.8 249.4 L 463.8 250.4 L 454.8 257.4 L 452.8 265.4 L 434.8 259.4 L 421.8 258.4 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Headbands</li>
        <li>Red wool felt</li>
        <li>Black cotton backing</li>
        <li>Rice paste décor</li>
      </ul>
    ),
    image: chuttituni,
  },
  {
    id: 'Kecchamani1',
    name: 'Kecchamani',
    pathD: 'M 409.8 959.4 L 410.8 992.4 L 414.8 1036.4 L 451.8 1040.4 L 484.8 1024.4 L 483.8 965.4 L 452.8 965.4 L 406.8 955.4 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Knee Bells</li>
        <li>Leather, cotton backing, batting, whip stitched, brass bells on metal findings</li>
        <li>11 bells per piece</li>
      </ul>
    ),
    image: kecchamani,
  },
  {
    id: 'Kecchamani2',
    name: 'Kecchamani',
    pathD: 'M 560.8 955.4 L 553.8 989.4 L 564.8 1024.4 L 591.8 1029.4 L 610.8 1017.4 L 617.8 962.4 L 564.8 956.4 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Knee Bells</li>
        <li>Leather, cotton backing, batting, whip stitched, brass bells on metal findings</li>
        <li>11 bells per piece</li>
      </ul>
    ),
    image: kecchamani,
  },
];

export default krishnaOrnamentsData;
