const fs = require('fs');
const path = require('path');

const pages = [
  ['Blog', 'Read the latest articles and insights.'],
  ['AffiliateProgram', 'Earn commissions by referring new users.'],
  ['FreeBusinessTools', 'Access helpful tools to grow your business.'],
  ['AboutUs', 'Learn more about our mission and team.'],
  ['Leadership', 'Meet the leaders driving our vision.'],
  ['InvestorRelations', 'Stay informed about our financial performance.'],
  ['Careers', 'Explore career opportunities with us.'],
  ['OurImpact', "See how we're making a difference."],
  ['Press', 'Check out our latest press releases and media coverage.'],
  ['ContactUs', 'Get in touch with our team for inquiries.'],
  ['TrustSafetySecurity', 'Learn how we keep the platform safe and secure.'],
  ['ModernSlaveryStatement', 'Read our commitment to combating modern slavery.']
];

const dir = path.join(__dirname, 'src/components/footerComponents');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

pages.forEach(([name, description]) => {
  const content = `
const ${name} = () => (
  <div className="container pt-5">
    <h2>${name.replace(/([A-Z])/g, ' $1').trim()}</h2>
    <p>${description}</p>
  </div>
);
export default ${name};
  `.trim();

  fs.writeFileSync(path.join(dir, `${name}.js`), content, 'utf8');
});

console.log('✅ Footer pages generated successfully.');
