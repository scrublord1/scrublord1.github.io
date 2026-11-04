/*
 * All site content lives here. Sources: your two resumes, your project photos,
 * github.com/scrublord1/stm32-mini-plc and the logic capture in its docs folder.
 * Add a value here only if you can back it up.
 */

const PLC_REPO = 'https://github.com/scrublord1/stm32-mini-plc'

export const profile = {
  name: 'Pritam Kumar',
  handle: 'pritam',
  role: 'Embedded Systems Engineer',
  tagline: 'Junior Research Fellow at IIT Delhi. Firmware and hardware, from bare metal to Zephyr.',
  bio: [
    'I build firmware and the hardware it runs on, across nRF52840, STM32, ESP32 and 8051.',
    'My major project is a PLC made from scratch, with its own ladder logic VM.',
  ],
  links: [
    {
      id: 'J1',
      label: 'Resume',
      detail: 'resume.pdf',
      href: '/resume.pdf',
      download: 'Pritam_Kumar_Resume.pdf',
    },
    {
      id: 'J2',
      label: 'GitHub',
      detail: 'github.com/scrublord1',
      href: 'https://github.com/scrublord1',
    },
    {
      id: 'J3',
      label: 'LinkedIn',
      detail: 'linkedin.com/in/pritam14a',
      href: 'https://www.linkedin.com/in/pritam14a',
    },
  ],
}

export const experience = [
  {
    role: 'Junior Research Fellow',
    org: 'Indian Institute of Technology (IIT) Delhi',
    place: 'New Delhi',
    dates: 'Sep 2026 to present',
    current: true,
    points: [
      'Embedded firmware and hardware for a sponsored biomedical device research project, with real-time sensor acquisition and actuator control.',
      'Taking a working prototype from breadboard to custom PCB, with a focus on reliability, power efficiency and hardware-firmware verification.',
    ],
  },
  {
    role: 'Graduate Engineer Trainee, R&D / New Product Development',
    org: 'Morphedo Technologies',
    place: 'Noida',
    dates: 'Jun 2026 to Sep 2026',
    points: [
      'Nordic nRF52840 bare-metal and Zephyr firmware and peripheral drivers in a defense-oriented R&D environment.',
      'Zephyr build system work with devicetree, Kconfig, CMake and west for new product bring-up.',
      'BLE FOTA architecture using MCUboot in swap-with-revert mode for fail-safe over-the-air updates.',
    ],
  },
  {
    role: 'Research Intern, Embedded Systems',
    org: 'National Institute of Technology (NIT) Patna',
    place: 'Patna',
    dates: 'Jun 2025 to Jul 2025',
    points: [
      'Built a multi-directional ultrasonic echo locator on NodeMCU, and explored material classification from reflected ultrasonic signals.',
    ],
    project: 'echo-locator',
  },
]

export const education = {
  degree: 'B.Tech, Electronics & Communication Engineering',
  school: 'Central University of Rajasthan (CURAJ), Ajmer',
  dates: '2022 to 2026',
  score: 'CGPA 7.91 / 10',
  coursework: 'Embedded Systems, Microcontrollers, Signal Processing, VLSI Design, Digital Signal Processing, Antenna and Wave Propagation',
}

export const certifications = [
  'MATLAB Onramp',
  'Simulink Onramp',
  'Introduction to Cybersecurity',
  'Networking Basics',
  'Workshop: Design and Simulation of ICs using Cadence EDA',
]

export const tabs = [
  { id: 'firmware', code: '01', label: 'Firmware & IoT' },
  { id: 'hardware', code: '02', label: 'Hardware & Circuits' },
  { id: 'signal', code: '03', label: 'Signal & Systems' },
]

export const focusAreas = [
  { id: 'fw', name: 'Bare-Metal Firmware', state: 'ACTIVE', tab: 'firmware' },
  { id: 'rtos', name: 'Zephyr & FreeRTOS', state: 'ACTIVE', tab: 'firmware' },
  { id: 'ble', name: 'BLE & FOTA', state: 'ACTIVE', tab: 'firmware' },
  { id: 'pcb', name: 'PCB Design', state: 'ACTIVE', tab: 'hardware' },
  { id: 'hw', name: 'Hardware Bring-Up', state: 'ACTIVE', tab: 'hardware' },
  { id: 'sig', name: 'Signal Processing', state: 'NOMINAL', tab: 'signal' },
]

/* Pin colours follow the bus, the same way a schematic colours its nets. */
export const busColors = {
  I2C: '#22d3ee',
  SPI: '#2dd4bf',
  UART: '#fbbf24',
  GPIO: '#cbd5e1',
  ADC: '#f0abfc',
  RS485: '#60a5fa',
  WIFI: '#34d399',
  USB: '#fb7185',
  SIG: '#a78bfa',
  PWR: '#f87171',
}

/*
 * Pin:    side 'L' or 'R', pad is the package pad or part, signal is the net name.
 *         Where the exact GPIO is not documented, pad names the connected part.
 * Metric: wave picks the oscilloscope trace. Options are sine, square, clock,
 *         pulse, step, ripple, burst, decay, spectrum and ramp. Traces are
 *         illustrative, the numbers are the real data.
 * Optional fields: repo, photo, video.
 */
export const projects = [
  /* 01_Firmware & IoT */
  {
    id: 'plc-core',
    tab: 'firmware',
    partNo: 'PLC-01',
    rev: 'May 2026',
    title: 'Mini PLC Core',
    subtitle: 'Ladder logic VM on an STM32',
    status: 'B.TECH MAJOR PROJECT',
    repo: PLC_REPO,
    photo: { src: '/photos/plc-board.jpg', alt: 'Mini PLC on perfboard with OLED showing the scan count, and the STM32 and ESP32 on a second board', caption: 'Final build on perfboard, OLED showing the live scan count' },
    summary:
      'A miniature industrial PLC built from scratch, with hardware costing under ₹2,000 as a low-cost option for automation training. A custom bytecode VM runs ladder programs on a fixed 10 ms scan, and they can be drawn in a desktop editor and downloaded over serial.',
    pinout: {
      chip: 'STM32F103C8T6',
      package: '72 MHz',
      pins: [
        { side: 'L', pad: 'PB6', signal: 'SCL', bus: 'I2C', note: 'Shared bus to the OLED and AT24C64, 100 kHz' },
        { side: 'L', pad: 'PB7', signal: 'SDA', bus: 'I2C', note: 'Shared bus data, EEPROM at address 0x50' },
        { side: 'L', pad: 'PA9', signal: 'TX1', bus: 'UART', note: 'Console and live monitor output, 115200 baud' },
        { side: 'L', pad: 'PA10', signal: 'RX1', bus: 'UART', note: 'Console commands and program upload' },
        { side: 'L', pad: 'PA0', signal: 'SCAN', bus: 'GPIO', note: 'Toggles every scan, for timing with a logic analyzer' },
        { side: 'R', pad: 'PA2', signal: 'TX2', bus: 'RS485', note: 'Modbus RTU replies, 9600 baud' },
        { side: 'R', pad: 'PA3', signal: 'RX2', bus: 'RS485', note: 'Modbus RTU requests, 9600 baud' },
        { side: 'R', pad: 'PB3', signal: 'DE', bus: 'RS485', note: 'MAX485 driver enable for half-duplex' },
        { side: 'R', pad: 'PB0', signal: 'START', bus: 'GPIO', note: 'Physical RUN button, active low' },
        { side: 'R', pad: 'PB1', signal: 'STOP', bus: 'GPIO', note: 'Forces all outputs off, active low' },
      ],
    },
    blockDiagram: {
      nodes: ['Ladder editor', 'UART upload', 'AT24C64 slot', 'Ladder VM', 'I/O image'],
      description:
        'The TIM2 interrupt runs each scan: read inputs into an I/O image, execute the program, write outputs. Console, OLED and Modbus are polled in the main loop, so they never hold up a scan.',
    },
    firmware: [
      'Bytecode VM with 14 opcodes, covering contacts, coils, timers and counters',
      'Bare-metal C on STM32 HAL, no RTOS',
      'Four EEPROM program slots with auto-boot of the last program',
      'Desktop ladder editor in Python and CustomTkinter, 845 lines',
    ],
    hardware: [
      'STM32F103C8T6 at 72 MHz from the external crystal',
      'AT24C64 8 KB EEPROM, 2 KB per program slot',
      '1.3 inch SH1106 OLED, refreshed at 5 Hz',
      'Prototyped on breadboard, then built on perfboard',
    ],
    metrics: [
      { label: 'Scan rate', value: '100', unit: 'Hz', wave: 'clock', detail: 'Measured on the SCAN pin with a logic analyzer' },
      { label: 'VM opcodes', value: '14', unit: 'ops', wave: 'pulse', detail: 'Defined in ladder_vm.h' },
      { label: 'Core clock', value: '72', unit: 'MHz', wave: 'sine', detail: 'HSE with PLL x9' },
      { label: 'Program slots', value: '4', unit: 'slots', wave: 'step', detail: 'Persist across power cycles in EEPROM' },
    ],
  },
  {
    id: 'flipper-edu',
    tab: 'firmware',
    partNo: 'SEC-01',
    rev: 'Sep 2024 to Dec 2025',
    title: 'Flipper EDU',
    subtitle: 'Embedded security toolkit on ESP32',
    status: 'LAB USE ONLY',
    photo: { src: '/photos/flipper-edu.jpg', alt: 'Flipper EDU with two OLED displays, RC522 RFID reader, IR module and three buttons in a black enclosure', caption: 'Enclosed build with dual OLEDs, RC522 reader and IR module' },
    summary:
      'A Flipper Zero inspired toolkit for learning how wireless and USB protocols behave and where they are weak. Built for academic study and used in a controlled lab environment.',
    pinout: {
      chip: 'ESP32',
      package: 'Toolkit',
      pins: [
        { side: 'L', pad: 'RC522', signal: 'RFID', bus: 'SPI', note: 'RFID and NFC reader module' },
        { side: 'L', pad: 'OLED 1', signal: 'MENU', bus: 'I2C', note: 'Tool menu display' },
        { side: 'L', pad: 'OLED 2', signal: 'STATUS', bus: 'I2C', note: 'Results display, such as a scanned card UID' },
        { side: 'R', pad: 'IR module', signal: 'IR', bus: 'GPIO', note: 'Infrared communication testing' },
        { side: 'R', pad: 'SW1 to SW3', signal: 'BTN', bus: 'GPIO', note: 'Three push buttons for menu navigation' },
        { side: 'R', pad: 'Radio', signal: 'WIFI', bus: 'WIFI', note: 'Wi-Fi and Bluetooth protocol experiments' },
        { side: 'R', pad: 'USB', signal: 'HID', bus: 'USB', note: 'Enumerates as a USB HID device for the BadUSB study' },
      ],
    },
    blockDiagram: {
      nodes: ['Push buttons', 'OLED menu', 'Tool module', 'Radio or USB', 'Result display'],
      description:
        'Tools are chosen from a menu on the OLED with three buttons. Each module drives its own interface and reports back on the second display.',
    },
    firmware: [
      'Embedded C in the Arduino IDE',
      'Wi-Fi deauthentication and USB HID modules, verified on physical hardware in a lab',
      'RFID/NFC, infrared and Bluetooth test modules',
      'Menu system across two displays',
    ],
    hardware: [
      'ESP32 with RC522 RFID reader',
      'Dual I2C OLED displays',
      'IR module and three push buttons',
      'Perfboard top plate in a compact enclosure',
    ],
    metrics: [
      { label: 'Verified modules', value: '2', unit: 'on hardware', wave: 'burst', detail: 'Wi-Fi and USB HID, in a controlled lab' },
      { label: 'Interfaces', value: '5', unit: 'types', wave: 'pulse', detail: 'Wi-Fi, Bluetooth, RFID/NFC, IR and USB' },
    ],
  },
  {
    id: 'esp32-hmi',
    tab: 'firmware',
    partNo: 'PLC-02',
    rev: 'May 2026',
    title: 'ESP32 HMI',
    subtitle: 'WiFi dashboard for the PLC',
    status: 'PART OF MINI PLC',
    repo: PLC_REPO,
    summary:
      'A WiFi bridge that reads the PLC state over serial and serves a live SCADA-style panel to any browser on the network, with no app to install.',
    pinout: {
      chip: 'ESP32',
      package: 'WiFi',
      pins: [
        { side: 'L', pad: 'GPIO16', signal: 'RX2', bus: 'UART', note: 'PLC state stream, 115200 baud' },
        { side: 'L', pad: 'GPIO17', signal: 'TX2', bus: 'UART', note: 'Serial2 transmit, 115200 baud' },
        { side: 'R', pad: 'RF', signal: 'WIFI', bus: 'WIFI', note: 'Web server on port 80, reachable through mDNS as plc.local' },
        { side: 'R', pad: 'USB', signal: 'DEBUG', bus: 'UART', note: 'USB serial logging, 115200 baud' },
      ],
    },
    blockDiagram: {
      nodes: ['PLC serial', 'JSON parser', '/state route', 'Browser panel'],
      description:
        'Serial lines tagged JSON: are parsed into inputs, outputs and the scan count. The page polls the /state route twice a second and redraws its indicators.',
    },
    firmware: [
      'Arduino framework with WebServer and ESPmDNS',
      'Self-contained SCADA-style HTML panel served from flash',
      '10 ms serial timeout, so a quiet link cannot stall the server',
      'Shows a link fault when the PLC stops reporting',
    ],
    hardware: ['ESP32 DevKit used as a WiFi bridge', 'Serial2 on GPIO16 and GPIO17'],
    metrics: [
      { label: 'Panel refresh', value: '500', unit: 'ms', wave: 'pulse', detail: 'Browser polls the /state route' },
      { label: 'Serial link', value: '115200', unit: 'baud', wave: 'burst', detail: 'Serial2, 8N1' },
      { label: 'Serial timeout', value: '10', unit: 'ms', wave: 'step', detail: 'Keeps the web server responsive' },
      { label: 'Points shown', value: '12', unit: 'I/O', wave: 'square', detail: '8 inputs and 4 outputs' },
    ],
  },
  {
    id: 'water-quality',
    tab: 'firmware',
    partNo: 'IOT-01',
    rev: 'Apr to May 2025',
    title: 'Water Quality',
    subtitle: 'Real-time TDS and EC monitor',
    status: 'WORKING PROTOTYPE',
    photo: { src: '/photos/water-quality.jpg', alt: 'TDS meter board wired through a breadboard to an LCD showing TDS and EC readings', caption: 'TDS sensor board with readings on the 16x2 LCD' },
    summary:
      'An IoT system that measures total dissolved solids and electrical conductivity, shows them on a local LCD, and sends them to the cloud for remote monitoring.',
    pinout: {
      chip: 'ESP32',
      package: 'IoT node',
      pins: [
        { side: 'L', pad: 'TDS meter', signal: 'TDS', bus: 'ADC', note: 'Analog output from the TDS sensor board' },
        { side: 'R', pad: 'LCD', signal: 'LCD', bus: 'GPIO', note: '16x2 character display for local readings' },
        { side: 'R', pad: 'RF', signal: 'WIFI', bus: 'WIFI', note: 'Live data to the Blynk app and dashboard' },
      ],
    },
    blockDiagram: {
      nodes: ['TDS sensor', 'ESP32', '16x2 LCD', 'Blynk cloud', 'Mobile and web'],
      description:
        'The ESP32 reads the sensor, shows TDS and EC on the LCD, and publishes the same values to Blynk for remote viewing.',
    },
    firmware: [
      'Reads and converts the TDS sensor output',
      'Local display on a 16x2 LCD',
      'Blynk integration for mobile and web dashboards',
    ],
    hardware: ['ESP32', 'TDS meter sensor board', '16x2 LCD', 'Breadboard prototype'],
    metrics: [
      { label: 'Parameters', value: '2', unit: 'TDS, EC', wave: 'ramp', detail: 'In ppm and µS/cm' },
      { label: 'Dashboards', value: '2', unit: 'views', wave: 'burst', detail: 'Blynk mobile and web' },
    ],
  },

  /* 02_Hardware & Circuits */
  {
    id: 'modulation-pcb',
    tab: 'hardware',
    partNo: 'PCB-01',
    rev: 'Oct to Dec 2024',
    title: 'Modulation PCB',
    subtitle: 'Analog and digital modulation board',
    status: 'FABRICATED',
    photo: { src: '/photos/modulation-pcb.jpg', alt: 'Hand-fabricated PCB with labelled AM, PAM, FM, PWM, PPM and ASK circuits and their demodulators', caption: 'The fabricated board, each circuit labelled on the silkscreen' },
    summary:
      'A single board carrying 12 circuits for modulating and demodulating signals. I designed it in KiCad and fabricated it by the silk screen method, then assembled and tested it.',
    pinout: {
      chip: 'MOD / DEMOD',
      package: '12 circuits',
      pins: [
        { side: 'L', pad: 'J1', signal: 'AM', bus: 'SIG', note: 'Amplitude modulator and demodulator' },
        { side: 'L', pad: 'J2', signal: 'PAM', bus: 'SIG', note: 'Pulse amplitude modulator and demodulator' },
        { side: 'L', pad: 'J3', signal: 'FM', bus: 'SIG', note: 'Frequency modulator with a hand-wound coil' },
        { side: 'L', pad: 'J4', signal: 'PWM', bus: 'SIG', note: 'Pulse width modulator' },
        { side: 'R', pad: 'J5', signal: 'PPM', bus: 'SIG', note: 'Pulse position modulator' },
        { side: 'R', pad: 'J6', signal: 'ASK', bus: 'SIG', note: 'Amplitude shift keying modulator and demodulator' },
        { side: 'R', pad: 'J7', signal: 'EMPH', bus: 'SIG', note: 'Pre-emphasis and de-emphasis networks' },
        { side: 'R', pad: 'J8', signal: 'RAILS', bus: 'PWR', note: '+9 V and ±12 V supply inputs' },
      ],
    },
    blockDiagram: {
      nodes: ['Message input', 'Modulator', 'Link jumpers', 'Demodulator', 'Recovered output'],
      description:
        'Modulators sit on the left of the board and demodulators on the right, with jumpers between them. Each section can be probed on its own or linked as a complete path.',
    },
    firmware: ['No firmware on this board, it is built from analog and mixed-signal circuits'],
    hardware: [
      'Schematic and layout in KiCad',
      'Fabricated by the silk screen method',
      'AM, PAM, ASK, FM, PWM and PPM with their demodulators',
      'Pre-emphasis and de-emphasis stages',
    ],
    metrics: [
      { label: 'Circuits', value: '12', unit: 'on one PCB', wave: 'spectrum', detail: 'Modulators, demodulators and emphasis stages' },
      { label: 'Schemes', value: '6', unit: 'types', wave: 'decay', detail: 'AM, PAM, ASK, FM, PWM and PPM' },
      { label: 'Supply', value: '±12', unit: 'V', wave: 'ripple', detail: 'Plus a +9 V rail, marked on the silkscreen' },
      { label: 'Design tool', value: 'KiCad', unit: '', wave: 'square', detail: 'Schematic through to fabrication' },
    ],
  },
  {
    id: 'io-stage',
    tab: 'hardware',
    partNo: 'PLC-03',
    rev: 'May 2026',
    title: 'Isolated I/O',
    subtitle: 'Optocoupler inputs, relay output',
    status: 'PART OF MINI PLC',
    repo: PLC_REPO,
    summary:
      'The circuit that lets the PLC face the outside world. Eight PC817 optocouplers isolate the inputs, and transistor stages switch the outputs.',
    pinout: {
      chip: 'STM32F103C8T6',
      package: 'I/O image',
      pins: [
        { side: 'L', pad: 'PB10', signal: 'I0', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PB11', signal: 'I1', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PB12', signal: 'I2', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PB13', signal: 'I3', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PB14', signal: 'I4', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PB15', signal: 'I5', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PA4', signal: 'I6', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'L', pad: 'PA5', signal: 'I7', bus: 'GPIO', note: 'PC817 isolated input, active low' },
        { side: 'R', pad: 'PA1', signal: 'Q0', bus: 'GPIO', note: 'Drives the 2N2222 and relay' },
        { side: 'R', pad: 'PA7', signal: 'Q1', bus: 'GPIO', note: 'Digital output' },
        { side: 'R', pad: 'PA8', signal: 'Q2', bus: 'GPIO', note: 'Digital output' },
        { side: 'R', pad: 'PA6', signal: 'Q3', bus: 'GPIO', note: 'Digital output' },
        { side: 'R', pad: 'PC13', signal: 'LED', bus: 'GPIO', note: 'Onboard LED mirrors Q0, active low' },
      ],
    },
    blockDiagram: {
      nodes: ['Field input', 'PC817', 'Input image', 'Output image', '2N2222', 'Relay'],
      description:
        'Field signals pass through the optocouplers into GPIO, and the firmware latches them into an I/O image at the start of every scan. Outputs are written only at the end of the scan.',
    },
    firmware: [
      'Inputs latched once per scan into the I/O image',
      'Active-low inputs inverted in io_read_inputs',
      'STOP button forces all outputs off immediately',
    ],
    hardware: [
      'PC817 optocoupler on each of the 8 inputs',
      '2N2222 transistor stage driving the relay module',
      'Input and output status LEDs on the perfboard',
    ],
    metrics: [
      { label: 'Isolated inputs', value: '8', unit: 'ch', wave: 'square', detail: 'PC817 optocouplers' },
      { label: 'Digital outputs', value: '4', unit: 'ch', wave: 'clock', detail: 'Q0 to Q3 in the I/O image' },
      { label: 'Transistor', value: '2N2222', unit: '', wave: 'step', detail: 'Relay driver stage' },
      { label: 'I/O update', value: '10', unit: 'ms', wave: 'pulse', detail: 'Once per scan cycle' },
    ],
  },
  {
    id: 'rs485-link',
    tab: 'hardware',
    partNo: 'PLC-04',
    rev: 'May 2026',
    title: 'RS485 Modbus',
    subtitle: 'Two STM32s on a Modbus RTU bus',
    status: 'PART OF MINI PLC',
    repo: PLC_REPO,
    summary:
      'The PLC acts as a Modbus RTU slave, tested against a second STM32 I programmed as the master, over a half-duplex RS485 link using MAX485.',
    pinout: {
      chip: 'STM32F103C8T6',
      package: 'Master',
      pins: [
        { side: 'L', pad: 'PA2', signal: 'TX2', bus: 'RS485', note: 'Modbus requests, 9600 baud' },
        { side: 'L', pad: 'PA3', signal: 'RX2', bus: 'RS485', note: 'Modbus responses, 9600 baud' },
        { side: 'L', pad: 'PB0', signal: 'BTN_ON', bus: 'GPIO', note: 'Sends a write coil ON to the PLC' },
        { side: 'R', pad: 'PA9', signal: 'TX1', bus: 'UART', note: 'Results to the PC console, 115200 baud' },
        { side: 'R', pad: 'PA10', signal: 'RX1', bus: 'UART', note: 'PC console input' },
        { side: 'R', pad: 'PB1', signal: 'BTN_OFF', bus: 'GPIO', note: 'Sends a write coil OFF to the PLC' },
      ],
    },
    blockDiagram: {
      nodes: ['Master STM32', 'RS485 bus', 'MAX485', 'PLC slave'],
      description:
        'The master sends a request and the slave validates its CRC, then acts on the function code. The slave raises its driver enable only while replying, so both ends can share the bus.',
    },
    firmware: [
      'Function codes FC01, FC03 and FC05 on the slave',
      'CRC-16 written from scratch, polynomial 0xA001',
      '5 ms frame timeout to separate messages',
      'Master firmware reads coils and the scan count, and writes coils',
    ],
    hardware: [
      'MAX485 RS485 transceiver',
      'Second STM32F103 as the Modbus master',
      'Half-duplex direction control on PB3 at the slave',
    ],
    metrics: [
      { label: 'Bus speed', value: '9600', unit: 'baud', wave: 'burst', detail: 'USART2 on both boards' },
      { label: 'Function codes', value: '3', unit: 'FC', wave: 'pulse', detail: 'FC01, FC03 and FC05' },
      { label: 'Frame timeout', value: '5', unit: 'ms', wave: 'step', detail: 'MODBUS_FRAME_TIMEOUT_MS' },
      { label: 'Slave address', value: '0x01', unit: '', wave: 'square', detail: 'MODBUS_SLAVE_ADDRESS' },
    ],
  },
  {
    id: '8051-motor',
    tab: 'hardware',
    partNo: 'MCU-01',
    rev: 'Mar to May 2025',
    title: '8051 Motor PWM',
    subtitle: 'DC motor speed control on AT89S51',
    status: 'WORKING PROTOTYPE',
    photo: { src: '/photos/8051-motor.jpg', alt: 'AT89S51 on a breadboard and development board wired to a motor driver and DC motor', caption: 'AT89S51 driving a DC motor through a driver module' },
    summary:
      'Speed control of a DC motor using pulse-width modulation generated by an 8051 microcontroller, with the speed set by a potentiometer and shown on an LCD.',
    pinout: {
      chip: 'AT89S51',
      package: '8051',
      pins: [
        { side: 'L', pad: 'POT', signal: 'SPEED', bus: 'SIG', note: 'Potentiometer sets the speed' },
        { side: 'L', pad: 'LCD', signal: 'LCD', bus: 'GPIO', note: '16x2 display of the speed variation' },
        { side: 'R', pad: 'Driver', signal: 'PWM', bus: 'SIG', note: 'Variable PWM to the motor driver' },
      ],
    },
    blockDiagram: {
      nodes: ['Potentiometer', 'AT89S51', 'PWM signal', 'Motor driver', 'DC motor'],
      description:
        'The potentiometer setting changes the PWM duty cycle generated in firmware. The driver turns that into motor speed, and the LCD gives real-time feedback.',
    },
    firmware: ['Embedded C in Keil µVision', 'Variable PWM generation in software', 'Character LCD driver for the 16x2 display'],
    hardware: ['AT89S51 microcontroller', 'Motor driver module and DC motor', 'Potentiometer and 16x2 LCD'],
    metrics: [
      { label: 'Control', value: 'PWM', unit: '', wave: 'square', detail: 'Duty cycle set by the potentiometer' },
      { label: 'Display', value: '16x2', unit: 'LCD', wave: 'step', detail: 'Real-time speed feedback' },
    ],
  },

  /* 03_Signal & Systems */
  {
    id: 'echo-locator',
    tab: 'signal',
    partNo: 'RES-01',
    rev: 'Jun to Jul 2025',
    title: 'Echo Locator',
    subtitle: 'Multi-directional ultrasonic ranging',
    status: 'NIT PATNA INTERNSHIP',
    photo: { src: '/photos/echo-locator.jpg', alt: 'NodeMCU on a breadboard with three HC-SR04 sensors, a DHT11, a demultiplexer and indicator LEDs', caption: 'NodeMCU with three HC-SR04 sensors, DHT11 and 74HC139' },
    summary:
      'A research internship build that ranges in three directions at once, with temperature compensation, and explores classifying materials by the acoustic impedance of reflected signals.',
    pinout: {
      chip: 'NodeMCU',
      package: 'ESP8266',
      pins: [
        { side: 'L', pad: 'HC-SR04 x3', signal: 'TRIG', bus: 'GPIO', note: 'Independent trigger line per sensor' },
        { side: 'L', pad: 'HC-SR04 x3', signal: 'ECHO', bus: 'GPIO', note: 'Independent echo line per sensor' },
        { side: 'L', pad: 'DHT11', signal: 'TEMP', bus: 'GPIO', note: 'Ambient temperature for speed of sound correction' },
        { side: 'R', pad: '74HC139', signal: 'SEL', bus: 'GPIO', note: 'Demultiplexer selects the active sensor' },
        { side: 'R', pad: 'LEDs x3', signal: 'LED', bus: 'GPIO', note: 'Active-low demux outputs drive sensor and LED together' },
      ],
    },
    blockDiagram: {
      nodes: ['NodeMCU', '74HC139 demux', 'Active HC-SR04', 'Echo timing', 'Compensated range'],
      description:
        'Sensors take turns on a round robin, so only one reports at a time and they cannot interfere. Each echo time is corrected for temperature using the DHT11 reading.',
    },
    firmware: [
      'Round robin sensor switching to prevent cross-talk',
      'DHT11 temperature compensation of range readings',
      'Reflected signal study for material classification',
    ],
    hardware: ['NodeMCU', 'Three HC-SR04 ultrasonic sensors', '74HC139 demultiplexer', 'DHT11 and indicator LEDs'],
    metrics: [
      { label: 'Sensors', value: '3', unit: 'directions', wave: 'decay', detail: 'HC-SR04, one active at a time' },
      { label: 'Switch interval', value: '3', unit: 's', wave: 'pulse', detail: 'Round robin between sensors' },
      { label: 'Compensation', value: 'DHT11', unit: '', wave: 'ramp', detail: 'Temperature correction of ranging' },
      { label: 'Demultiplexer', value: '74HC139', unit: '', wave: 'clock', detail: 'Drives sensors and LEDs together' },
    ],
  },
  {
    id: 'scan-timing',
    tab: 'signal',
    partNo: 'PLC-05',
    rev: 'May 2026',
    title: 'Scan Timing',
    subtitle: 'Logic analyzer validation of the scan',
    status: 'MEASURED',
    repo: PLC_REPO,
    summary:
      'A PLC is only useful if its scan is deterministic, so I checked mine. I captured the scan pin for one second at 1 MHz and measured every edge.',
    pinout: {
      chip: 'STM32F103C8T6',
      package: 'TIM2',
      pins: [
        { side: 'L', pad: 'PA0', signal: 'SCAN', bus: 'GPIO', note: 'Toggled at the start of every scan' },
        { side: 'R', pad: 'D0', signal: 'PROBE', bus: 'SIG', note: 'Logic analyzer channel, 1 MHz sample rate' },
      ],
    },
    blockDiagram: {
      nodes: ['TIM2 interrupt', 'Toggle PA0', 'Scan cycle', 'Logic capture', 'Edge statistics'],
      description:
        'TIM2 divides 72 MHz by 7200 and then by 100 to fire every 10 ms. Because the pin toggles once per scan, the capture shows a 50 Hz square wave with an edge at every scan.',
    },
    firmware: [
      'TIM2 prescaler 7200 and period 100 give a 10 ms tick',
      'Scan runs inside HAL_TIM_PeriodElapsedCallback',
      'Scan pulse toggled before any other work in the cycle',
    ],
    hardware: ['Logic analyzer at 1 MHz, captured in sigrok', '1,000,000 samples over 1 second', '100 edges measured on channel D0'],
    metrics: [
      { label: 'Scan period', value: '10.00', unit: 'ms', wave: 'clock', detail: 'Mean of 99 intervals: 9999.42 µs' },
      { label: 'Period spread', value: '1', unit: 'µs', wave: 'step', detail: '9999 to 10000 µs, the capture resolution' },
      { label: 'Pin frequency', value: '50', unit: 'Hz', wave: 'square', detail: 'One toggle per scan' },
      { label: 'Sample rate', value: '1', unit: 'MHz', wave: 'pulse', detail: '1 µs measurement resolution' },
    ],
  },
  {
    id: 'smart-navigator',
    tab: 'signal',
    partNo: 'IOT-02',
    rev: 'Sep 2025',
    title: 'Smart Navigator',
    subtitle: 'Obstacle alert wearable',
    status: 'PROTOTYPE',
    summary:
      'An assistive prototype on a glasses frame to help visually impaired people detect obstacles. It sounds a buzzer when anything comes close and shows the distance on a dashboard.',
    pinout: {
      chip: 'ESP32',
      package: 'Wearable',
      pins: [
        { side: 'L', pad: 'HC-SR04', signal: 'RANGE', bus: 'GPIO', note: 'Ultrasonic distance sensor on the frame' },
        { side: 'R', pad: 'Buzzer', signal: 'ALERT', bus: 'GPIO', note: 'Sounds within the 100 cm range' },
        { side: 'R', pad: 'RF', signal: 'WIFI', bus: 'WIFI', note: 'Distance data to the Blynk dashboard' },
      ],
    },
    blockDiagram: {
      nodes: ['HC-SR04', 'ESP32', 'Distance check', 'Buzzer alert', 'Blynk dashboard'],
      description:
        'The ESP32 measures distance continuously, sounds the buzzer below the threshold, and streams the reading to a mobile dashboard. Impedance sensing for material detection was explored as a future step.',
    },
    firmware: ['Distance measurement with a threshold alert', 'Real-time data on the Blynk IoT dashboard'],
    hardware: ['ESP32', 'HC-SR04 and buzzer', 'Mounted on a wearable glasses frame'],
    metrics: [
      { label: 'Alert range', value: '100', unit: 'cm', wave: 'decay', detail: 'Buzzer sounds inside this distance' },
      { label: 'Dashboard', value: 'Blynk', unit: '', wave: 'burst', detail: 'Live distance on mobile' },
    ],
  },
  {
    id: 'line-follower',
    tab: 'signal',
    partNo: 'BOT-01',
    rev: 'Oct to Nov 2024',
    title: 'Line Follower',
    subtitle: 'Proportional control robot',
    status: 'WORKING PROTOTYPE',
    photo: { src: '/photos/line-follower.jpg', alt: 'Two-wheel robot with an Arduino, battery, motor driver with heatsink and IR sensors', caption: 'Two-wheel chassis with Arduino UNO and IR sensors' },
    video: 'https://drive.google.com/file/d/1L3P3sMMTg97mqnmwWH7-9WuUT5hZh6oU/view',
    summary:
      'An autonomous two-wheel robot that follows a black line using IR sensors, with proportional speed control for smooth turns and line recovery.',
    pinout: {
      chip: 'Arduino UNO',
      package: 'ATmega328P',
      pins: [
        { side: 'L', pad: 'IR sensors', signal: 'LINE', bus: 'GPIO', note: 'Detects the black line path' },
        { side: 'R', pad: 'Driver', signal: 'MOTOR_L', bus: 'SIG', note: 'Left motor speed through the driver' },
        { side: 'R', pad: 'Driver', signal: 'MOTOR_R', bus: 'SIG', note: 'Right motor speed through the driver' },
      ],
    },
    blockDiagram: {
      nodes: ['IR sensors', 'Arduino UNO', 'Proportional control', 'Motor driver', 'BO motors'],
      description:
        'The sensors report where the line is, and the controller adjusts each motor in proportion to the error. Sensor placement and motor speed were tuned for stable tracking.',
    },
    firmware: ['Proportional speed control', 'Line recovery behaviour', 'Tuned for smooth turns'],
    hardware: ['Arduino UNO and motor driver', 'IR sensors', '300 RPM BO motors on a two-wheel chassis'],
    metrics: [
      { label: 'Motor speed', value: '300', unit: 'RPM', wave: 'sine', detail: 'BO motors' },
      { label: 'Control', value: 'P', unit: 'loop', wave: 'step', detail: 'Proportional speed control' },
    ],
  },
]

export const signalChain = {
  stages: [
    {
      id: 'physical',
      code: 'STAGE 01',
      label: 'Physical World',
      note: 'Sense, isolate, route',
      output: 'GPIO · ADC · I2C · SPI · RS485',
      skills: [
        { id: 'sensors', name: 'Sensors', meta: 'HC-SR04, DHT11, TDS, IR', projects: ['echo-locator', 'water-quality', 'smart-navigator', 'line-follower'] },
        { id: 'rf', name: 'RF & Wireless', meta: 'BLE, Wi-Fi, RFID', projects: ['flipper-edu', 'esp32-hmi'] },
        { id: 'pcb', name: 'PCB Design', meta: 'KiCad, schematic, fabrication', projects: ['modulation-pcb'] },
        { id: 'iso', name: 'Industrial I/O', meta: 'PC817, relays, MAX485', projects: ['io-stage', 'rs485-link'] },
        { id: 'bench', name: 'Bench Debugging', meta: 'DSO, CRO, logic analyzer', projects: ['scan-timing', 'modulation-pcb'] },
      ],
    },
    {
      id: 'processing',
      code: 'STAGE 02',
      label: 'Processing Layer',
      note: 'Sample, compute, decide',
      output: 'UART · BLE · MQTT · Modbus',
      skills: [
        { id: 'mcu', name: 'Microcontrollers', meta: 'nRF52840, STM32, ESP32, AT89S51', projects: ['plc-core', 'flipper-edu', '8051-motor', 'echo-locator'] },
        { id: 'c', name: 'Embedded C / C++', meta: 'Bare metal, interrupts, DMA, drivers', projects: ['plc-core', 'scan-timing', '8051-motor'] },
        { id: 'fpga', name: 'FPGAs', meta: 'VHDL, Xilinx Vivado and ISE', projects: [] },
        { id: 'proto', name: 'Protocols', meta: 'UART, I2C, SPI, Modbus RTU', projects: ['rs485-link', 'plc-core'] },
      ],
    },
    {
      id: 'application',
      code: 'STAGE 03',
      label: 'Application Layer',
      note: 'Schedule, update, connect',
      output: 'FOTA · Dashboards · Tools',
      skills: [
        { id: 'rtos', name: 'RTOS', meta: 'Zephyr, FreeRTOS', projects: [] },
        { id: 'fota', name: 'BLE FOTA', meta: 'MCUboot, SMP, secure boot', projects: [] },
        { id: 'python', name: 'Python', meta: 'CustomTkinter, pyserial', projects: ['plc-core'] },
        {
          id: 'cloud',
          name: 'Cloud & IoT',
          meta: 'Blynk, AWS, Terraform, MQTT',
          projects: ['water-quality', 'smart-navigator'],
          link: { label: 'AWS pipeline repo', href: 'https://github.com/scrublord1/event-driven-pipeline-aws' },
        },
        {
          id: 'matlab',
          name: 'MATLAB',
          meta: 'Signals, convolution, Simulink',
          projects: [],
          link: { label: 'MATLAB labs repo', href: 'https://github.com/scrublord1/Matlab-project' },
        },
      ],
    },
  ],
  links: [
    ['sensors', 'mcu'],
    ['sensors', 'c'],
    ['rf', 'mcu'],
    ['rf', 'proto'],
    ['pcb', 'mcu'],
    ['pcb', 'fpga'],
    ['iso', 'proto'],
    ['iso', 'c'],
    ['bench', 'c'],
    ['bench', 'fpga'],
    ['mcu', 'rtos'],
    ['mcu', 'fota'],
    ['mcu', 'cloud'],
    ['c', 'rtos'],
    ['c', 'python'],
    ['proto', 'python'],
    ['proto', 'cloud'],
    ['fpga', 'matlab'],
  ],
}
