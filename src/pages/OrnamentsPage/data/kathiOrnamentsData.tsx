import kireedam from 'assets/images/kathakali-ornaments/kireedam.png';
import thoda from 'assets/images/kathakali-ornaments/thoda.png';
import chevippuvu from 'assets/images/kathakali-ornaments/chevippuvu.png';
import kathichutti from 'assets/images/kathakali-ornaments/kathichutti.png';
import kazhuthunada from 'assets/images/kathakali-ornaments/kazhuthunada.png';
import kazhuttaram from 'assets/images/kathakali-ornaments/kazhuttaram.png';
import paruttikkaimani from 'assets/images/kathakali-ornaments/paruttikkaimani.png';
import tolputtu from 'assets/images/kathakali-ornaments/tolputtu.png';
import kuralaram from 'assets/images/kathakali-ornaments/kuralaram.png';
import uttariya from 'assets/images/kathakali-ornaments/uttariya.png';
import kastakatakam from 'assets/images/kathakali-ornaments/kastakatakam.png';
import kalases from 'assets/images/kathakali-ornaments/kalases.png';
import pattuval from 'assets/images/kathakali-ornaments/pattuval.png';
import patiarannanam from 'assets/images/kathakali-ornaments/patiarannanam.png';
import ottanakku from 'assets/images/kathakali-ornaments/ottanakku.png';
import chuttituni from 'assets/images/kathakali-ornaments/chuttituni.png';
import type { Ornament } from './types';



const kathiOrnamentsData: Ornament[] = [
  {
    id: 'kireedam',
    name: 'Kireedam',
    pathD: 'M 374.2 421.0 L 330.2 383.2 L 299.2 340.2 L 287.2 296.2 L 291.2 232.2 L 324.2 173.2 L 375.2 134.2 L 442.2 118.2 L 472.2 120.0 L 507.2 134.0 L 543.2 158.0 L 573.2 187.0 L 592.2 240.0 L 599.2 288.0 L 583.2 346.0 L 548.2 391.0 L 499.2 424.0 L 493.2 413.0 L 377.2 411.0 L 375.2 416.0 Z',
    tooltipPosition: { top: '10%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Headdress (Crown) of Kathi</li>
        <li>2 pieces carved wood: disc & crown</li>
      </ul>
    ),
    image: kireedam,
  },
  {
    id: 'thoda1',
    name: 'Thoda',
    pathD: 'M 363.2 366.0 L 345.2 374.0 L 343.2 394.0 L 359.2 410.0 L 375.2 408.0 L 382.2 389.0 L 376.2 372.0 L 364.2 364.0 Z',
    tooltipPosition: { top: '20%', left: '93%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Ear Ornaments</li>
        <li>Worn with Kireedam headdress</li>
        <li>Larger than Chevippuvu</li>
      </ul>
    ),
    image: thoda,
  },
  {
    id: 'thoda2',
    name: 'Thoda',
    pathD: 'M 508.2 372.8 L 492.2 380.8 L 494.2 400.8 L 510.2 412.8 L 526.2 405.8 L 533.2 384.8 L 522.2 372.8 L 509.2 371.8 Z',
    tooltipPosition: { top: '20%', left: '93%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Ear Ornaments</li>
        <li>Worn with Kireedam headdress</li>
        <li>Larger than Chevippuvu</li>
      </ul>
    ),
    image: thoda,
  },
  {
    id: 'chevippuvu1',
    name: 'Chevippuvu',
    pathD: 'M 357.2 432.6 L 346.2 438.6 L 338.2 451.6 L 342.2 469.6 L 355.2 478.6 L 376.2 471.6 L 384.2 451.6 L 369.2 432.6 L 359.2 432.6 Z',
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
    id: 'chevippuvu2',
    name: 'Chevippuvu',
    pathD: 'M 502.2 435.8 L 490.2 448.8 L 490.2 463.8 L 495.2 471.8 L 513.2 474.8 L 524.2 463.8 L 526.2 443.8 L 504.2 433.8 Z',
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
    pathD: 'M 383.2 468.2 L 357.2 476.2 L 342.2 497.2 L 352.2 518.2 L 413.2 547.2 L 471.2 539.2 L 522.2 514.2 L 528.2 502.2 L 522.2 483.2 L 487.2 468.2 L 485.2 508.2 L 479.2 518.2 L 430.2 537.2 L 387.2 515.2 L 383.2 468.2 Z',
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>White facial ridges</li>
        <li>Made from a mixture of rice paste and lime</li>
        <li>Highlights the facial make-up and curcial for distinguishing characters and their personalities</li>
        <li>Besides the face framing chutti, Kathialso wears white, knob-like chutti flowers on the nose and between the eyebrows</li>
      </ul>
    ),
    image: kathichutti,
  },
  {
    id: 'chutti2',
    name: 'Chutti',
    pathD: 'M 427.2 414.6 L 421.2 420.6 L 421.2 429.6 L 430.2 435.6 L 440.2 431.6 L 441.2 420.6 L 428.2 414.2 Z',
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>White facial ridges</li>
        <li>Made from a mixture of rice paste and lime</li>
        <li>Highlights the facial make-up and curcial for distinguishing characters and their personalities</li>
        <li>Besides the face framing chutti, Kathialso wears white, knob-like chutti flowers on the nose and between the eyebrows</li>      
      </ul>
    ),
    image: kathichutti,
  },
  {
    id: 'chutti3',
    name: 'Chutti',
    pathD: 'M 431.2 483.4 L 421.2 490.4 L 421.2 502.4 L 430.2 508.4 L 442.2 506.4 L 445.2 497.4 L 444.2 488.4 L 433.2 482.4 Z',
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>White facial ridges</li>
        <li>Made from a mixture of rice paste and lime</li>
        <li>Highlights the facial make-up and curcial for distinguishing characters and their personalities</li>
        <li>Besides the face framing chutti, Kathialso wears white, knob-like chutti flowers on the nose and between the eyebrows</li>
      </ul>
    ),
    image: kathichutti,
  },    
  {
    id: 'Kazhuthu nada',
    name: 'Kazhuthu nada',
    pathD: 'M 393.2 549.0 L 395.2 562.0 L 427.2 574.0 L 462.2 569.0 L 472.2 564.0 L 476.2 550.0 L 452.2 559.0 L 432.2 563.0 L 409.2 557.0 L 393.2 547.0 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Choker</li>
        <li>Black cotton and red woolover cotton tape</li>
        <li>Worn over kazhuttartam (necklace) to keep in place</li>
      </ul>
    ),
    image: kazhuthunada,
  },
  {
    id: 'Kazhuttaram',
    name: 'Kazhuttaram',
    pathD: 'M 395.2 567.8 L 399.2 588.8 L 380.2 688.8 L 386.2 763.8 L 419.2 797.8 L 439.2 798.8 L 462.2 749.8 L 481.2 689.8 L 469.2 613.8 L 470.2 596.8 L 466.2 582.8 L 473.2 563.8 L 448.2 569.8 L 425.2 570.8 L 394.2 561.8 Z',
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
    pathD: 'M 223.2 648.8 L 227.2 665.8 L 238.2 672.8 L 254.2 657.8 L 282.2 658.8 L 319.2 678.8 L 331.2 654.8 L 294.2 640.8 L 254.2 633.8 L 223.2 647.8 Z',
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
    pathD: 'M 587.2 673.8 L 638.2 677.8 L 650.2 644.8 L 636.2 636.8 L 641.2 617.8 L 625.2 616.8 L 614.2 618.8 L 610.2 639.8 L 595.2 652.8 L 588.2 672.8 Z',
    tooltipPosition: { top: '40%', left: '93%' },
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
    pathD: 'M 283.2 588.8 L 320.2 579.8 L 329.2 588.8 L 300.2 645.8 L 282.2 635.8 L 243.2 638.8 L 280.2 590.8 Z',
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
    pathD: 'M 545.2 573.8 L 556.2 587.8 L 568.2 635.8 L 618.2 613.8 L 588.2 574.8 L 570.2 567.8 L 545.2 572.8 Z',
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
    id: 'Kuralaram',
    name: 'Kuralaram',
    pathD: 'M 371.2 772.8 L 368.2 790.8 L 379.2 804.8 L 419.2 814.8 L 471.2 806.8 L 491.2 810.8 L 513.2 803.8 L 520.2 786.8 L 517.2 775.8 L 474.2 780.8 L 411.2 777.8 L 373.2 766.8 L 371.2 771.8 Z',
    tooltipPosition: { top: '25%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Men&apos;s breastplate</li>
        <li>10 pieces carved wood</li>
        <li>Neck bound with stitched cotton tape</li>
      </ul>
    ),
    image: kuralaram,
  },
  {
    id: 'Uttariya1',
    name: 'Uttariya',
    pathD: 'M 376.2 535.8 L 360.2 548.8 L 350.2 566.8 L 336.2 577.8 L 310.2 705.8 L 167.2 890.8 L 137.2 912.8 L 84.2 981.8 L 69.2 990.8 L 62.2 1002.8 L 40.2 997.8 L 27.2 1007.8 L 11.2 1010.8 L 0.2 1022.8 L 0.2 1126.8 L 16.2 1122.8 L 36.2 1138.8 L 91.2 1039.8 L 83.2 1023.8 L 98.2 997.8 L 112.2 993.8 L 152.2 938.8 L 183.2 926.8 L 287.2 832.8 L 256.2 916.8 L 259.2 942.8 L 246.2 958.8 L 246.2 971.8 L 211.2 970.8 L 203.2 990.8 L 186.2 1018.8 L 151.2 1087.8 L 190.2 1125.8 L 220.2 1124.8 L 283.2 1115.8 L 346.2 1131.8 L 409.2 1112.8 L 403.2 1088.8 L 429.2 1070.8 L 438.2 1047.8 L 378.2 965.8 L 362.2 969.8 L 347.2 945.8 L 357.2 922.8 L 356.2 770.8 L 338.2 709.8 L 360.2 586.8 L 372.2 567.8 L 374.2 533.8 Z',
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
    id: 'Uttariya2',
    name: 'Uttariya',
    pathD: 'M 492.2 530.8 L 491.2 614.8 L 531.2 816.8 L 533.2 854.8 L 554.2 942.8 L 551.2 979.8 L 531.2 981.8 L 526.2 1008.8 L 535.2 1030.8 L 524.2 1063.8 L 526.2 1102.8 L 579.2 1119.8 L 649.2 1111.8 L 700.2 1070.8 L 751.2 1024.8 L 782.2 1059.8 L 797.2 1109.8 L 826.2 1150.8 L 855.2 1139.8 L 866.2 1140.8 L 911.2 1106.8 L 840.2 1012.8 L 805.2 1006.8 L 785.2 987.8 L 772.2 990.8 L 735.2 918.8 L 710.2 887.8 L 701.2 862.8 L 644.2 785.8 L 575.2 701.8 L 564.2 677.8 L 554.2 584.8 L 540.2 566.8 L 517.2 549.8 L 503.2 531.8 L 494.2 530.8 Z',
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
    pathD: 'M 356.2 693.8 L 359.2 718.8 L 372.2 724.8 L 378.2 753.8 L 372.2 770.8 L 376.2 783.8 L 386.2 790.8 L 407.2 783.8 L 426.2 777.8 L 417.2 750.8 L 406.2 745.8 L 395.2 711.8 L 408.2 692.8 L 408.2 677.8 L 393.2 678.8 L 381.2 686.8 L 357.2 690.8 Z',
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
    pathD: 'M 488.2 685.8 L 492.2 702.8 L 507.2 707.8 L 509.2 742.8 L 496.2 752.8 L 491.2 770.8 L 509.2 783.8 L 523.2 775.8 L 535.2 784.8 L 550.2 773.8 L 554.2 754.8 L 537.2 741.8 L 539.2 711.8 L 550.2 708.8 L 550.2 680.8 L 527.2 672.8 L 511.2 683.8 L 500.2 680.8 L 487.2 683.8 Z',
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
    pathD: 'M 326.2 712.8 L 327.2 749.8 L 343.2 778.8 L 382.2 760.8 L 375.2 745.8 L 371.2 723.8 L 359.2 717.8 L 354.2 706.8 L 327.2 710.8 Z',
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
    pathD: 'M 536.2 710.8 L 540.2 744.8 L 550.2 758.8 L 550.2 769.8 L 578.2 769.8 L 591.2 738.8 L 581.2 704.8 L 559.2 703.8 L 539.2 709.8 Z',
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
    pathD: 'M 377.2 537.6 L 371.2 571.6 L 357.2 616.6 L 341.2 707.6 L 355.2 711.6 L 355.2 695.6 L 373.2 684.6 L 380.2 689.6 L 399.2 588.6 L 395.2 574.6 L 394.2 550.6 L 379.2 535.6 Z',
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
    pathD: 'M 491.2 534.8 L 475.2 549.8 L 466.2 584.8 L 472.2 595.8 L 471.2 616.8 L 458.2 623.8 L 455.2 635.8 L 441.2 630.8 L 403.2 637.8 L 394.2 657.8 L 417.2 694.8 L 420.2 754.8 L 437.2 790.8 L 461.2 817.8 L 476.2 799.8 L 490.2 754.8 L 503.2 684.8 L 515.2 684.8 L 522.2 677.8 L 534.2 647.8 L 508.2 619.8 L 492.2 615.8 L 490.2 533.8 Z',
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
    pathD: 'M 315.2 829.4 L 371.2 962.4 L 398.2 992.4 L 413.2 998.0 L 404.2 1016.0 L 447.2 1025.0 L 448.2 1014.0 L 438.2 1001.0 L 492.2 967.0 L 506.2 953.0 L 556.2 819.0 L 528.2 821.0 L 486.2 829.0 L 444.2 840.0 L 390.2 841.0 L 346.2 824.0 L 325.2 801.0 L 314.2 828.0 Z',
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
    pathD: 'M 378.2 900.2 L 370.2 963.2 L 381.2 1116.2 L 385.2 1152.2 L 399.2 1186.2 L 416.2 1196.2 L 426.2 1200.2 L 414.2 1213.2 L 416.2 1233.2 L 432.2 1240.2 L 445.2 1228.2 L 449.2 1208.2 L 438.2 1198.2 L 470.2 1188.2 L 494.2 1129.2 L 499.2 1052.2 L 501.2 941.2 L 485.2 893.2 L 460.2 906.2 L 400.2 909.2 L 379.2 897.2 Z',
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
    pathD: 'M 367.2 434.0 L 377.2 419.0 L 469.2 419.0 L 495.2 429.0 L 501.2 439.0 L 485.2 457.0 L 464.2 438.0 L 408.2 438.0 L 395.2 438.0 L 380.2 451.0 L 366.2 434.0 Z',
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

export default kathiOrnamentsData;
