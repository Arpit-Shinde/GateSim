function encodeInstruction(instruction) {
    const opcodes = {
        addi: 0b0000,
        add: 0b0001,
        sub: 0b0010,
        lw: 0b0011,
        sw: 0b0100
    };

    function toBinary(value, width) {
        value = BigInt(value);

        const min = -(1n << BigInt(width - 1));
        const max = (1n << BigInt(width)) - 1n;

        if (value < min || value > max) {
            throw new Error(`Value ${value} does not fit in ${width} bits`);
        }

        return BigInt.asUintN(width, value)
            .toString(2)
            .padStart(width, "0");
    }

    function reg(value) {
        const n = Number(value);

        if (!Number.isInteger(n) || n < 0 || n > 15) {
            throw new Error(`Invalid register: ${value}`);
        }

        return toBinary(n, 4);
    }

    // Normalize whitespace and commas
    instruction = instruction.trim().replace(/,/g, " ");
    const parts = instruction.split(/\s+/);

    const mnemonic = parts[0].toLowerCase();

    if (!(mnemonic in opcodes)) {
        throw new Error(`Unknown instruction: ${mnemonic}`);
    }

    let imm = "0".repeat(16);
    let rd = "0000";
    let rs1 = "0000";
    let rs2 = "0000";

    switch (mnemonic) {
        case "addi": {
            // addi rd, rs1, imm
            if (parts.length !== 4) throw new Error("Invalid addi syntax");

            rd = reg(parts[1]);
            rs1 = reg(parts[2]);
            imm = toBinary(parts[3], 16);
            break;
        }

        case "add":
        case "sub": {
            // add/sub rd, rs1, rs2
            if (parts.length !== 4) throw new Error(`Invalid ${mnemonic} syntax`);

            rd = reg(parts[1]);
            rs1 = reg(parts[2]);
            rs2 = reg(parts[3]);
            break;
        }

        case "lw":
        case "sw": {
            // lw rd, imm(rs1)
            // sw rs2, imm(rs1)

            if (parts.length !== 3) {
                throw new Error(`Invalid ${mnemonic} syntax`);
            }

            const match = parts[2].match(/^(-?\d+)\((-?\d+)\)$/);

            if (!match) {
                throw new Error("Expected offset(base), e.g. 9(2)");
            }

            imm = toBinary(match[1], 16);
            rs1 = reg(match[2]);

            if (mnemonic === "lw") {
                rd = reg(parts[1]);
            } else {
                rs2 = reg(parts[1]);
            }

            break;
        }
    }

    return (
        imm +
        rd +
        rs1 +
        rs2 +
        toBinary(opcodes[mnemonic], 4)
    );
}

function printInstructionFields(binary) {
    console.log(
        binary.slice(0, 16) + " " +
        binary.slice(16, 20) + " " +
        binary.slice(20, 24) + " " +
        binary.slice(24, 28) + " " +
        binary.slice(28, 32)
    );
}

function assemble(instruction) {
    const binary = encodeInstruction(instruction);

    return binary
        .split("")
        .reverse()
        .map(bit => bit === "1");
}

function toBoolArray(num, width) {
    num = BigInt.asUintN(width, BigInt(num));

    return Array.from({ length: width }, (_, i) =>
        Boolean((num >> BigInt(i)) & 1n)
    );
}

function loadInstruction(writeData, rd, CLK, address, instruction) {
    // Encode and load instruction
    writeData.value = assemble(instruction);
    update(writeData.id);

    // Set instruction memory address
    rd.value = toBoolArray(address, 4);
    update(rd.id);

    // Trigger falling-edge write
    CLK.value[0] = 1;
    update(CLK.id);

    CLK.value[0] = 0;
    update(CLK.id);
}

function tickClock(CLK, cycles) {
    const clockId = CLK.id;

    let clock = get(clockId);
    let state = Number(clock.value[0] || 0);
    const initialState = state;

    let completed = 0;

    const timer = setInterval(() => {
        state = 1 - state;

        // Always fetch the latest node
        clock = get(clockId);
        clock.value[0] = state;

        update(clockId);

        // One complete cycle when we return to initial state
        if (state === initialState) {
            completed++;

            if (completed >= cycles) {
                clearInterval(timer);
                print("Clock stopped after", completed, "cycles");
            }
        }
    }, 500);

    return timer;
}

printInstructionFields(encodeInstruction("addi 1 0 4"))
printInstructionFields(encodeInstruction("addi 2 0 5"))
printInstructionFields(encodeInstruction("add 3 1 2"))
printInstructionFields(encodeInstruction("sw 3 2(0)"))
console.log(assemble("addi 1 0 4"))
printInstructionFields(encodeInstruction("lw 4 2(0)"))

loadInstruction(writeData, rd, CLK, 2, "addi 2 0 15")
