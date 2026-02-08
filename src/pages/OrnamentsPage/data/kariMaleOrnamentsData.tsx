import karimudi from 'assets/images/kathakali-ornaments/karimudi.png';
import karichutti from 'assets/images/kathakali-ornaments/karichutti.png';
import chevippuvu from 'assets/images/kathakali-ornaments/chevippuvu.png';
import kazhuttaram from 'assets/images/kathakali-ornaments/kazhuttaram.png';
import paruttikkaimani from 'assets/images/kathakali-ornaments/paruttikkaimani.png';
import tolputtu from 'assets/images/kathakali-ornaments/tolputtu.png';
import uttariya from 'assets/images/kathakali-ornaments/uttariya.png';
import kastakatakam from 'assets/images/kathakali-ornaments/kastakatakam.png';
import kalases from 'assets/images/kathakali-ornaments/kalases.png';
import pattuval from 'assets/images/kathakali-ornaments/pattuval.png';
import patiarannanam from 'assets/images/kathakali-ornaments/patiarannanam.png';
import ottanakku from 'assets/images/kathakali-ornaments/ottanakku.png';
import chuttituni from 'assets/images/kathakali-ornaments/chuttituni.png';
import type { Ornament } from './types';

const kariMaleOrnamentsData: Ornament[] = [
  {
    id: 'kari mudi',
    name: 'Kari Mudi',
    pathD: 'M 390.2 249.0 L 382.2 262.0 L 386.2 278.0 L 410.2 288.0 L 442.2 315.0 L 467.2 364.0 L 467.2 408.0 L 523.2 409.0 L 577.2 408.0 L 580.2 352.0 L 594.2 288.0 L 617.2 258.0 L 572.2 217.0 L 532.2 213.0 L 446.2 237.0 L 427.2 229.0 L 418.2 238.0 L 392.2 248.0 Z',
    tooltipPosition: { top: '10%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Headdress of kari</li>
        <li>Like that of the karutta with peacock feather trim</li>
      </ul>
    ),
    image: karimudi,
  },
  {
    id: 'chevippuvu',
    name: 'Chevippuvu',
    pathD: 'M 493.2 431.6 L 482.2 445.6 L 484.2 456.6 L 493.2 463.6 L 503.2 454.6 L 510.2 440.6 L 505.2 430.6 L 494.2 430.6 Z',
    tooltipPosition: { top: '30%', left: '88%' },
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
    pathD: 'M 587.2 453.4 L 579.2 460.4 L 573.2 473.4 L 580.2 484.4 L 599.2 484.4 L 599.2 468.4 L 590.2 454.4 Z',
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Made from a mixture of rice paste and lime</li>
        <li>Highlights the facial make-up and curcial for distinguishing characters and their personalities</li>
        <li>Centered on the nose with strips pointing outwards</li>
      </ul>
    ),
    image: karichutti,
  },

  {
    id: 'Kazhuttaram',
    name: 'Kazhuttaram',
    pathD: 'M 512.2 589.2 L 524.2 657.2 L 547.2 690.2 L 554.2 708.2 L 578.2 717.2 L 586.2 697.2 L 576.2 678.2 L 559.2 595.2 L 516.2 589.2 Z',
    tooltipPosition: { top: '22%', left: '95%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Necklace</li>
        <li>Plastic and metal gold toned beads</li>
        <li>Two red woolpompoms</li>
      </ul>
    ),
    image: kazhuttaram,
  },
  {
    id: 'Paruttikkaimani1',
    name: 'Paruttikkaimani',
    pathD: 'M 350.2 543.2 L 347.2 570.2 L 381.2 568.2 L 417.2 582.2 L 434.2 553.2 L 391.2 534.2 L 347.2 539.2 Z',
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
    pathD: 'M 606.2 558.2 L 591.2 580.2 L 608.2 613.2 L 624.2 589.2 L 624.2 568.2 L 607.2 557.2 Z',
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
    id: 'Tolputtu',
    name: 'Tolputtu',
    pathD: 'M 377.2 494.2 L 363.2 540.2 L 411.2 549.2 L 423.2 492.2 L 407.2 480.2 L 394.2 480.2 L 377.2 493.2 Z',
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
    pathD: 'M 442.2 488.2 L 434.2 538.2 L 420.2 543.2 L 413.2 583.2 L 418.2 706.2 L 455.2 848.2 L 460.2 863.2 L 447.2 868.2 L 440.2 884.2 L 447.2 901.2 L 431.2 963.2 L 460.2 977.2 L 474.2 972.2 L 515.2 976.2 L 511.2 996.2 L 558.2 1015.2 L 593.2 1001.2 L 587.2 977.2 L 627.2 959.2 L 654.2 933.2 L 660.2 918.2 L 683.2 913.2 L 691.2 954.2 L 707.2 967.2 L 749.2 951.2 L 755.2 939.2 L 731.2 865.2 L 715.2 853.2 L 701.2 825.2 L 704.2 810.2 L 640.2 673.2 L 589.2 581.2 L 563.2 592.2 L 611.2 834.2 L 599.2 863.2 L 577.2 850.2 L 561.2 818.2 L 510.2 593.2 L 459.2 480.2 L 439.2 488.2 Z',
    tooltipPosition: { top: '42%', left: '93%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Neck streamers/scarves</li>
        <li>White cotton, 36”x78”, tied at center and third marks; striped area at edge tied off with folded/pleated self ruffles and stuffed full at stripes plus smell ball above</li>
      </ul>
    ),
    image: uttariya,
  },
  {
    id: 'Kastakatakam1',
    name: 'Kastakatakam',
    pathD: 'M 451.2 552.2 L 440.2 563.2 L 447.2 574.2 L 462.2 570.2 L 472.2 580.2 L 484.2 576.2 L 484.2 562.2 L 474.2 556.2 L 466.2 563.2 L 453.2 552.2 Z',
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
    pathD: 'M 625.2 605.2 L 619.2 618.2 L 629.2 624.2 L 635.2 635.2 L 650.2 632.2 L 648.2 614.2 L 636.2 613.2 L 626.2 604.2 Z',
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
    pathD: 'M 409.2 585.2 L 416.2 625.2 L 430.2 647.2 L 467.2 637.2 L 453.2 608.2 L 456.2 575.2 L 410.2 584.2 Z',
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
    pathD: 'M 645.2 600.2 L 631.2 616.2 L 631.2 639.2 L 641.2 654.2 L 673.2 656.2 L 654.2 645.2 L 652.2 632.2 L 651.2 614.2 L 672.2 603.2 L 647.2 599.2 Z',
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
    pathD: 'M 177.2 1038.2 L 67.2 997.2 L 80.2 982.2 L 150.2 755.2 L 196.2 689.2 L 279.2 626.2 L 342.2 573.2 L 328.2 647.2 L 272.2 717.2 L 201.2 802.2 L 175.2 936.2 L 176.2 1037.2 Z',
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
    id: 'Pattu Val2',
    name: 'Pattu Val',
    pathD: 'M 646.2 671.2 L 646.2 690.2 L 673.2 745.2 L 803.2 993.2 L 814.2 1003.2 L 879.2 929.2 L 762.2 734.2 L 648.2 667.2 Z',
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
    id: 'Patiarannanam',
    name: 'Patiarannanam',
    pathD: 'M 405.2 693.2 L 498.2 762.2 L 540.2 791.2 L 589.2 781.2 L 631.2 706.2 L 637.2 657.2 L 583.2 705.2 L 523.2 705.2 L 453.2 686.2 L 404.2 691.2 Z',
    tooltipPosition: { top: '37%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Men&apos;s belt</li>
        <li>Decorated with gilt foil, plastic jewels and red wool felt</li>
        <li>Tied with white cotton cord</li>
      </ul>
    ),
    image: patiarannanam,
  },
  {
    id: 'Ottanakku',
    name: 'Ottanakku',
    pathD: 'M 519.2 782.2 L 558.2 894.2 L 583.2 911.2 L 602.2 899.2 L 605.2 854.2 L 591.2 772.2 L 557.2 781.2 L 515.2 779.2 Z',
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
    id: 'Chuttituni',
    name: 'Chuttituni',
    pathD: 'M 467.2 420.2 L 467.2 447.2 L 479.2 435.2 L 502.2 428.2 L 556.2 407.2 L 575.2 412.2 L 579.2 405.2 L 555.2 400.2 L 523.2 408.2 L 469.2 417.2 Z',
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
];

export default kariMaleOrnamentsData;
