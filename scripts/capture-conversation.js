async (page) => {
  const chat = page.locator('iframe[title="Copilot chat"]').contentFrame();
  const promptInput = chat.getByRole('textbox', { name: 'Prompt', exact: true });
  const prompts = [
    'What events are happening this week?',
    'Which events are already completed?',
    'Which events are online?'
  ];
  const messages = await chat.getByRole('list', { name: 'Chat Messages', exact: true }).innerText();
  const matches = prompts.map((prompt, index) => ({ prompt, index })).filter(entry => messages.includes(entry.prompt));
  if (matches.length !== 1) throw new Error('Expected one recognized pilot conversation.');
  if (await chat.getByRole('button', { name: 'Stop generating', exact: true }).count()) throw new Error('Response is still generating.');
  const caseId = String(matches[0].index + 1).padStart(2, '0');
  const dimensions = await promptInput.evaluate(element => {
    const doc = element.ownerDocument;
    doc.activeElement?.blur();
    const scrolls = [...doc.querySelectorAll('*')].filter(node => {
      const style = doc.defaultView.getComputedStyle(node);
      return node.querySelector('[role="list"], table') && ((/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2)
        || (/(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 2));
    });
    return scrolls.map((node, index) => {
      node.setAttribute('data-eval-scroll', String(index));
      return { index, width: node.clientWidth, height: node.clientHeight, maxX: node.scrollWidth - node.clientWidth, maxY: node.scrollHeight - node.clientHeight, originalX: node.scrollLeft, originalY: node.scrollTop };
    });
  });
  const positions = (maximum, size) => {
    const values = [0];
    while (values[values.length - 1] < maximum) values.push(Math.min(maximum, values[values.length - 1] + Math.max(1, Math.floor(size * 0.75))));
    return values;
  };
  const vertical = dimensions.find(item => item.maxY > 2);
  const horizontal = dimensions.filter(item => item.maxX > 2);
  const verticalPositions = vertical ? positions(vertical.maxY, vertical.height) : [0];
  const horizontalPositions = horizontal.reduce((combinations, item) => combinations.flatMap(combination => positions(item.maxX, item.width).map(left => [...combination, { index: item.index, left } ])), [[]]);
  const captures = [];
  try {
    for (const top of verticalPositions) {
      for (const horizontalOffsets of horizontalPositions) {
        const offsets = await promptInput.evaluate(async (element, state) => {
          const doc = element.ownerDocument;
          for (const node of doc.querySelectorAll('[data-eval-scroll]')) {
            const index = Number(node.getAttribute('data-eval-scroll'));
            const left = state.horizontalOffsets.find(offset => offset.index === index)?.left || 0;
            node.scrollTo({ top: state.vertical?.index === index ? state.top : 0, left, behavior: 'instant' });
          }
          await new Promise(resolve => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(resolve)));
          const actual = [...doc.querySelectorAll('[data-eval-scroll]')].map(node => ({ index: Number(node.getAttribute('data-eval-scroll')), top: node.scrollTop, left: node.scrollLeft }));
          for (const offset of actual) {
            const expectedTop = state.vertical?.index === offset.index ? state.top : 0;
            const expectedLeft = state.horizontalOffsets.find(item => item.index === offset.index)?.left || 0;
            if (Math.abs(offset.top - expectedTop) > 2 || Math.abs(offset.left - expectedLeft) > 2) throw new Error('Scroll position did not settle; capture aborted.');
          }
          return actual;
        }, { vertical, top, horizontalOffsets });
        const filename = `pilot-${caseId}-window-${String(captures.length + 1).padStart(2, '0')}.png`;
        await page.screenshot({ path: `/Users/vaibhavverma/ODSP Evals Automation/images/lists-pilot/${filename}`, fullPage: false, scale: 'css' });
        captures.push({ filename, offsets });
      }
    }
  } finally {
    await promptInput.evaluate((element, dimensions) => {
      for (const item of dimensions) {
        const node = element.ownerDocument.querySelector(`[data-eval-scroll="${item.index}"]`);
        if (!node) continue;
        node.scrollTo({ top: item.originalY, left: item.originalX, behavior: 'instant' });
        node.removeAttribute('data-eval-scroll');
      }
    }, dimensions);
  }
  return { caseId, prompt: matches[0].prompt, capturedAt: new Date().toISOString(), viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight })), dimensions, captures };
}