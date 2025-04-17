function submitBetToGoogleSheet() {
  if (selectedBets.length === 0) {
    alert("Please select at least one bet before submitting");
    return;
  }

  const betAmountInput = document.getElementById('bet-amount');
  const potentialWinningsElement = document.getElementById('potential-winnings');

  if (!betAmountInput || !potentialWinningsElement) return;

  const betAmount = parseFloat(betAmountInput.value) || 0;
  const potentialWinnings = potentialWinningsElement.textContent.replace('$', '');

  const betType = selectedBets.length > 1 ? 'Parlay' : 'Single';

  let odds;
  if (selectedBets.length === 1) {
    odds = formatOdds(selectedBets[0].odds);
  } else {
    odds = formatOdds(calculateParlayOdds(selectedBets));
  }

  const betDetails = selectedBets.map(bet => {
    return {
      matchup: `${bet.awayTeam} @ ${bet.homeTeam}`,
      team: bet.team,
      betType: bet.betTypeLabel,
      selection: bet.displayName,
      odds: formatOdds(bet.odds)
    };
  });

  const formData = {
    date: new Date().toISOString(),
    betType: betType,
    numberOfLegs: selectedBets.length,
    wagerAmount: betAmount.toFixed(2),
    potentialWinnings: potentialWinnings,
    totalOdds: odds,
    betDetails: JSON.stringify(betDetails)
  };

  const placeBetButton = document.getElementById('place-bet-button');
  if (placeBetButton) {
    placeBetButton.disabled = true;
    placeBetButton.textContent = 'Placing Bet...';
    placeBetButton.classList.add('opacity-75');
  }

  document.getElementById('success-message').classList.add('hidden');
  document.getElementById('error-message').classList.add('hidden');

  const scriptURL = 'https://script.google.com/macros/s/AKfycbz4IGrxpDwk-N-HVLiefEpCNVASf1TcM8DbXnZ7G_ZO0m3J-X9FYoWlWkpd3a3nliHzfw/exec';
  
  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors', // 👈 Needed to bypass CORS restrictions
    body: JSON.stringify(formData)
  })
  .then(() => {
    if (placeBetButton) {
      placeBetButton.disabled = false;
      placeBetButton.textContent = 'Place Bet';
      placeBetButton.classList.remove('opacity-75');
    }
    document.getElementById('success-message').classList.remove('hidden');
  })
  .catch(() => {
    if (placeBetButton) {
      placeBetButton.disabled = false;
      placeBetButton.textContent = 'Place Bet';
      placeBetButton.classList.remove('opacity-75');
    }
    document.getElementById('error-message').classList.remove('hidden');
  });
}
