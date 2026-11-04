/*
 * All site content lives here. Everything below comes from the public repos
 * github.com/scrublord1/stm32-mini-plc and github.com/scrublord1/Matlab-project.
 * Metrics come from the firmware configuration or the logic capture in
 * docs/scan_cycle_timing_10ms. Add a value here only if you can back it up.
 */

const PLC_REPO = 'https://github.com/scrublord1/stm32-mini-plc'

export const profile = {
  name: 'Pritam Kumar',
  handle: 'pritam',
  role: 'Electronics & Communication Engineer',
  tagline: 'Bare-metal firmware, industrial I/O and the tools around them.',
  bio: [
    'I like building the whole system, from the input pin to the dashboard.',
    'My B.Tech major project is a PLC built from scratch on an STM32.',
  ],
  links: [
    {
      id: 'J1',
      label: 'Resume',
      detail: 'resume.pdf',
      href: '/resume.pdf',
      download: true,
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
      detail: 'linkedin.com/in/your-handle',
      href: 'https://www.linkedin.com/in/your-handle',
    },
  ],
}

export const tabs = [
  { id: 'firmware', code: '01', label: 'Firmware & IoT' },
  { id: 'hardware', code: '02', label: 'Hardware & Circuits' },
  { id: 'signal', code: '03', label: 'Signal & Systems' },
]

/* The order matches the chips on the board, each LED is routed to one chip. */
export const focusAreas = [
  { id: 'fw', name: 'Embedded Firmware', state: 'ACTIVE', tab: 'firmware' },
  { id: 'iot', name: 'IoT & Dashboards', state: 'ACTIVE', tab: 'firmware' },
  { id: 'io', name: 'Industrial I/O', state: 'ACTIVE', tab: 'hardware' },
  { id: 'bus', name: 'Serial Protocols', state: 'ACTIVE', tab: 'hardware' },
  { id: 'rt', name: 'Real-Time Timing', state: 'ACTIVE', tab: 'signal' },
  { id: 'sig', name: 'Signal Analysis', state: 'NOMINAL', tab: 'signal' },
]

/* Pin colours follow the bus, the same way a schematic colours its nets. */
export const busColors = {
  I2C: '#22d3ee',
  UART: '#fbbf24',
  GPIO: '#cbd5e1',
  RS485: '#60a5fa',
  WIFI: '#34d399',
  SIG: '#a78bfa',
}

/*
 * Pin:    side 'L' or 'R', pad is the package pad, signal is the net name.
 * Metric: wave picks the oscilloscope trace. Options are sine, square, clock,
 *         pulse, step, ripple, burst, decay, spectrum and ramp. Traces are
 *         illustrative, the numbers are the real data.
 */
export const projects = [
  {
    id: 'plc-core',
    tab: 'firmware',
    partNo: 'PLC-01',
    rev: 'May 2026',
    title: 'Mini PLC Core',
    subtitle: 'Ladder logic VM on an STM32',
    status: 'B.TECH MAJOR PROJECT',
    repo: PLC_REPO,
    summary:
      'The heart of my miniature industrial PLC, built from scratch. A custom bytecode VM runs ladder programs on a fixed 10 ms scan, and they can be drawn in a desktop editor and downloaded over serial.',
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
      'Bytecode VM with 14 opcodes, including TON, CTU and LDEQ',
      'Bare-metal C on STM32 HAL, no RTOS',
      'Four EEPROM program slots with auto-boot of the last program',
      'Desktop ladder editor in Python and CustomTkinter, 845 lines',
    ],
    hardware: [
      'STM32F103C8T6 at 72 MHz from the external crystal',
      'AT24C64 8 KB EEPROM, 2 KB per program slot',
      '1.3 inch SH1106 OLED, refreshed at 5 Hz',
      'Prototyped and demonstrated on breadboard',
    ],
    metrics: [
      { label: 'Scan rate', value: '100', unit: 'Hz', wave: 'clock', detail: 'Measured on the SCAN pin with a logic analyzer' },
      { label: 'VM opcodes', value: '14', unit: 'ops', wave: 'pulse', detail: 'Defined in ladder_vm.h' },
      { label: 'Core clock', value: '72', unit: 'MHz', wave: 'sine', detail: 'HSE with PLL x9' },
      { label: 'Program slots', value: '4', unit: 'slots', wave: 'step', detail: 'Persist across power cycles in EEPROM' },
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
      'Tracks whether the PLC link is alive',
    ],
    hardware: [
      'ESP32 module used as a WiFi bridge',
      'Serial2 on GPIO16 and GPIO17',
    ],
    metrics: [
      { label: 'Panel refresh', value: '500', unit: 'ms', wave: 'pulse', detail: 'Browser polls the /state route' },
      { label: 'Serial link', value: '115200', unit: 'baud', wave: 'burst', detail: 'Serial2, 8N1' },
      { label: 'Serial timeout', value: '10', unit: 'ms', wave: 'step', detail: 'Keeps the web server responsive' },
      { label: 'Points shown', value: '12', unit: 'I/O', wave: 'square', detail: '8 inputs and 4 outputs' },
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
      'The circuit that lets the PLC face the outside world. Eight PC817 optocouplers isolate the inputs, and a 2N2222 transistor drives the relay on output Q0.',
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
      'Built and tested on breadboard',
    ],
    metrics: [
      { label: 'Isolated inputs', value: '8', unit: 'ch', wave: 'square', detail: 'PC817 optocouplers' },
      { label: 'Digital outputs', value: '4', unit: 'ch', wave: 'clock', detail: 'Q0 to Q3 in the I/O image' },
      { label: 'Relay outputs', value: '1', unit: 'ch', wave: 'step', detail: 'Q0 through the 2N2222' },
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
      'The PLC acts as a Modbus RTU slave, tested against a second STM32 I programmed as the master. The two talk half-duplex through MAX485 transceivers.',
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
      nodes: ['Master STM32', 'MAX485', 'RS485 bus', 'MAX485', 'PLC slave'],
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
    hardware: [
      'Logic analyzer at 1 MHz, captured in sigrok',
      '1,000,000 samples over 1 second',
      '100 edges measured on channel D0',
    ],
    metrics: [
      { label: 'Scan period', value: '10.00', unit: 'ms', wave: 'clock', detail: 'Mean of 99 intervals: 9999.42 µs' },
      { label: 'Period spread', value: '1', unit: 'µs', wave: 'step', detail: '9999 to 10000 µs, the capture resolution' },
      { label: 'Pin frequency', value: '50', unit: 'Hz', wave: 'square', detail: 'One toggle per scan' },
      { label: 'Sample rate', value: '1', unit: 'MHz', wave: 'pulse', detail: '1 µs measurement resolution' },
    ],
  },
  {
    id: 'matlab-labs',
    tab: 'signal',
    partNo: 'LAB-01',
    rev: '2024',
    title: 'MATLAB Labs',
    subtitle: 'Signals and systems coursework',
    status: 'COURSEWORK',
    repo: 'https://github.com/scrublord1/Matlab-project',
    summary:
      'Lab scripts from my coursework, covering signal generation, sampling, signal arithmetic and convolution, plus a circuit theorem check.',
    pinout: {
      chip: 'MATLAB',
      package: 'Scripts',
      pins: [
        { side: 'L', pad: 'LAB2', signal: 'SAMPLED', bus: 'SIG', note: 'Plots continuous, discrete and sampled signals' },
        { side: 'L', pad: 'LAB4', signal: 'ARITH', bus: 'SIG', note: 'Adds, subtracts, multiplies and divides signals' },
        { side: 'R', pad: 'LAB7', signal: 'CONV', bus: 'SIG', note: 'Convolves two discrete sequences and plots them' },
        { side: 'R', pad: 'LAB3', signal: 'MPT', bus: 'SIG', note: 'Sweeps load resistance to show maximum power transfer' },
      ],
    },
    blockDiagram: {
      nodes: ['Input sequence', 'MATLAB script', 'Plotted result'],
      description:
        'Each script takes signals or component values, computes the result, and plots it so it can be checked against the analytical answer.',
    },
    firmware: [
      'Discrete convolution with conv',
      'Continuous, discrete and sampled signal plots',
      'Load sweep from 1 to 9 ohms in 0.01 steps',
    ],
    hardware: ['Software only, no hardware'],
    metrics: [
      { label: 'Signal labs', value: '4', unit: 'scripts', wave: 'sine', detail: 'LAB2, LAB4, LAB5 and LAB7' },
      { label: 'Circuit labs', value: '1', unit: 'script', wave: 'ramp', detail: 'LAB3, maximum power transfer' },
    ],
  },
]

export const signalChain = {
  stages: [
    {
      id: 'physical',
      code: 'STAGE 01',
      label: 'Physical World',
      note: 'Isolate, switch, wire',
      output: 'GPIO · I2C · RS485',
      skills: [
        { id: 'inputs', name: 'Isolated Inputs', meta: 'PC817 optocouplers', projects: ['io-stage'] },
        { id: 'drive', name: 'Output Drive', meta: '2N2222, relay', projects: ['io-stage'] },
        { id: 'rs485', name: 'RS485 Wiring', meta: 'MAX485, half-duplex', projects: ['rs485-link'] },
        { id: 'bench', name: 'Bench Debugging', meta: 'Logic analyzer, sigrok', projects: ['scan-timing'] },
      ],
    },
    {
      id: 'processing',
      code: 'STAGE 02',
      label: 'Processing Layer',
      note: 'Sample, compute, decide',
      output: 'UART · Modbus · WiFi',
      skills: [
        { id: 'mcu', name: 'Microcontrollers', meta: 'STM32, ESP32, 8051', projects: ['plc-core', 'esp32-hmi', 'rs485-link'] },
        { id: 'c', name: 'Embedded C', meta: 'STM32 HAL, timers, interrupts', projects: ['plc-core', 'rs485-link', 'scan-timing'] },
        { id: 'vm', name: 'Bytecode VM', meta: 'Ladder logic interpreter', projects: ['plc-core'] },
        { id: 'proto', name: 'Serial Protocols', meta: 'UART, I2C, Modbus RTU', projects: ['rs485-link', 'plc-core'] },
      ],
    },
    {
      id: 'application',
      code: 'STAGE 03',
      label: 'Application Layer',
      note: 'Program, monitor, analyse',
      output: 'Editor · Dashboard · Plots',
      skills: [
        { id: 'python', name: 'Python', meta: 'CustomTkinter, pyserial', projects: ['plc-core'] },
        { id: 'web', name: 'Web HMI', meta: 'ESP32 WebServer, HTML, JS', projects: ['esp32-hmi'] },
        { id: 'matlab', name: 'MATLAB', meta: 'Signals, convolution', projects: ['matlab-labs'] },
        { id: 'cloud', name: 'Cloud', meta: 'AWS, Terraform, CI/CD', projects: [] },
      ],
    },
  ],
  links: [
    ['inputs', 'mcu'],
    ['inputs', 'c'],
    ['drive', 'mcu'],
    ['drive', 'c'],
    ['rs485', 'proto'],
    ['bench', 'c'],
    ['mcu', 'web'],
    ['mcu', 'python'],
    ['c', 'python'],
    ['vm', 'python'],
    ['proto', 'web'],
    ['proto', 'cloud'],
    ['c', 'matlab'],
  ],
}
