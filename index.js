const chunk = require('lodash.chunk');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
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

const doc = new PDFDocument({ autoFirstPage: false });
doc.pipe(fs.createWriteStream('badges.pdf'));

const attendees = parse(fs.readFileSync('data.csv', 'utf8'), { columns: true });
const blankBadges = (new Array(20)).fill({
  'TEAM': '',
  'First Name': '',
  'Last Name': '',
});

const attendeesByPage = chunk(attendees.concat(blankBadges), badgeRowsPerPage);

attendeesByPage.forEach((attendees) => {
  renderPage(attendees);
});

doc.end();

function fontSizeForString(string) {
  if (string.length > 12) { return 18; }
  if (string.length > 9) { return 20; }
  return 25;
}

function renderBadge(x, y, attendee) {
  doc.image('givecamp-logo.png', x + (badgeWidth * pdfDPI) - 70, y + 10, {
      width: 60,
    });

  if (!attendee) { return; }

  doc.fillColor('black')
    .font('Helvetica-Bold')
    .fontSize(fontSizeForString(attendee['First Name']))
    .text(attendee['First Name'].toUpperCase(), x + 10, y + 35, {
      align: 'left',
      ellipsis: true,
      height: 10,
      indent: 0,
      width: (badgeWidth * pdfDPI) - 20,
    })
    .font('Helvetica-Bold')
    .fontSize(fontSizeForString(attendee['Last Name']))
    .text(attendee['Last Name'].toUpperCase(), {
      align: 'left',
      ellipsis: true,
      height: 10,
      indent: 0,
      width: (badgeWidth * pdfDPI) - 20,
    })
    .font('Helvetica')
    .fontSize(20)
    .text(attendee.TEAM, x, y + 121, {
      align: 'center',
      ellipsis: true,
      height: 10,
      indent: 0,
      width: (badgeWidth * pdfDPI) - 10,
    });
}

function renderPage(attendees) {
  doc.addPage();

  for (let i = 0; i < badgeRowsPerPage; i++) {
    const badgeY = extraPageVerticalMargin + (i * badgeHeight * pdfDPI);

    doc.rect(extraPageHorizontalMargin, badgeY + (badgeHeight * pdfDPI) - barHeight, pdfWidth - (extraPageHorizontalMargin * 2), barHeight)
      .fill('#6fb055');

    if (attendees[i]) {
      renderBadge(extraPageHorizontalMargin, badgeY, attendees[i]);
      renderBadge(extraPageHorizontalMargin + (badgeWidth * pdfDPI), badgeY, attendees[i]);
    }
  }
}
