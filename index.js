const fs = require('fs');
const PDFDocument = require('pdfkit');

const pdfDPI = 72;
const badgeHeight = 2;
const badgeWidth = 3.5;

const paperHeight = 11;
const paperWidth = 8.5;

const pdfHeight = paperHeight * pdfDPI;
const pdfWidth = paperWidth * pdfDPI;

const badgeRowsPerPage = 5;
const badgesPerRow = 2;
const barHeight = 30;
const extraPageHorizontalMargin = (paperWidth - (badgeWidth * badgesPerRow)) * pdfDPI / 2;
const extraPageVerticalMargin = (paperHeight - (badgeHeight * badgeRowsPerPage)) * pdfDPI / 2;

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('badges.pdf'));

for (let i = 0; i < badgeRowsPerPage; i++) {
  const badgeY = extraPageVerticalMargin + (i * badgeHeight * pdfDPI);

  doc.rect(extraPageHorizontalMargin, badgeY + (badgeHeight * pdfDPI) - barHeight, pdfWidth - (extraPageHorizontalMargin * 2), barHeight)
    .fill('#6fb055');

  renderBadge(extraPageHorizontalMargin, badgeY);
  renderBadge(extraPageHorizontalMargin + (badgeWidth * pdfDPI), badgeY);
}

doc.end();

function fontSizeForString(string) {
  if (string.length > 12) { return 20; }
  if (string.length > 9) { return 23; }
  return 25;
}

function renderBadge(x, y) {
  doc.fillColor('black')
    .fontSize(fontSizeForString('Sankareshw'))
    .text('Sankareshwari', x + 10, y + 35, {
      align: 'left',
      ellipsis: true,
      height: 10,
      indent: 0,
      width: (badgeWidth * pdfDPI) - 20,
    })
    .fontSize(fontSizeForString('Shewinvanakitkul'))
    .text('Shewinvanakitkul', {
      align: 'left',
      ellipsis: true,
      height: 10,
      indent: 0,
      width: (badgeWidth * pdfDPI) - 20,
    })
    .fontSize(20)
    .text('Photography', x, y + 121, {
      align: 'center',
      ellipsis: true,
      height: 10,
      indent: 0,
      width: (badgeWidth * pdfDPI) - 10,
    })
    .image('givecamp-logo.png', x + (badgeWidth * pdfDPI) - 70, y + 10, {
      width: 60,
    });
}
