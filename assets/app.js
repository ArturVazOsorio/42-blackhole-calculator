import { PACE_MATRIX } from './matrix.js';

function formatDate(date) {
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function initCalculator() {
  const startDateInput = document.getElementById('startDate');
  const paceInput = document.getElementById('pace');
  const milestoneInput = document.getElementById('milestone');
  const freezeInput = document.getElementById('freeze');
  const bonusInput = document.getElementById('bonus');

  // Define data atual como valor inicial
  startDateInput.valueAsDate = new Date();

  function update() {
    if (!startDateInput.value) return;

    const currentPace = parseInt(paceInput.value);
    const milestone = parseInt(milestoneInput.value);
    const freeze = parseInt(freezeInput.value) || 0;
    const bonus = parseInt(bonusInput.value) || 0;

    const [year, month, day] = startDateInput.value.split('-').map(Number);

    // 1. Blackhole (Pace 24)
    const p24Days = PACE_MATRIX[milestone][24];
    const totalBlackholeDays = p24Days + freeze + bonus;
    const blackholeDate = new Date(year, month - 1, day);
    blackholeDate.setDate(blackholeDate.getDate() + totalBlackholeDays);

    document.getElementById('blackholeDate').innerText = formatDate(blackholeDate);
    document.getElementById('blackholeDays').innerText = 
      `Total: ${totalBlackholeDays} dias (${p24Days}d [P24] + ${freeze}d Freeze + ${bonus}d Bônus)`;

    // 2. Limite do Pace Atual (Troca de Pace)
    const noticeBox = document.getElementById('paceNoticeBox');
    if (currentPace === 24) {
      noticeBox.classList.add('hidden');
    } else {
      noticeBox.classList.remove('hidden');
      const currentPaceDays = PACE_MATRIX[milestone][currentPace];
      const totalPaceDays = currentPaceDays + freeze + bonus;
      const paceDate = new Date(year, month - 1, day);
      paceDate.setDate(paceDate.getDate() + totalPaceDays);

      document.getElementById('paceSwitchDate').innerText = formatDate(paceDate);
    }
  }

  [startDateInput, paceInput, milestoneInput, freezeInput, bonusInput].forEach(el => {
    el.addEventListener('input', update);
  });

  update();
}

document.addEventListener('DOMContentLoaded', initCalculator);