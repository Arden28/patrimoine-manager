import { jsPDF } from 'jspdf';

const handleGenerateDeclaration = (formData, t, language, setSuccess, setError) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 50;

    // Title
    doc.setFontSize(20);
    doc.text('Personal Information Declaration', 297.5, y, { align: 'center' });
    y += 20;
    doc.setFontSize(12);
    doc.text(`Prepared for ${formData.firstNames} ${formData.usedName}`, 297.5, y, { align: 'center' });
    y += 15;
    doc.text(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), 297.5, y, { align: 'center' });
    y += 30;

    // Personal Details
    doc.setFontSize(14);
    doc.text('Personal Details', 40, y);
    y += 20;
    doc.setFontSize(10);
    doc.text(`Name: ${formData.firstNames} ${formData.usedName}`, 40, y);
    y += 15;
    doc.text(`Birth Name: ${formData.birthName}`, 40, y);
    y += 15;
    doc.text(`Date of Birth: ${formData.dateOfBirth}`, 40, y);
    y += 15;
    doc.text(`Place of Birth: ${formData.placeOfBirth}`, 40, y);
    y += 15;
    doc.text(`Status: ${formData.status}`, 40, y);
    y += 15;
    doc.text(`Address: ${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`, 40, y);
    y += 15;
    doc.text(`Phone: ${formData.phone}`, 40, y);
    y += 15;
    doc.text(`Email: ${formData.email}`, 40, y);
    y += 15;
    doc.text(`Annual Income: $${parseFloat(formData.annualIncome).toLocaleString('en-US')}`, 40, y);
    y += 15;
    doc.text(`Net Worth: $${parseFloat(formData.netWorth).toLocaleString('en-US')}`, 40, y);
    y += 15;
    doc.text(`Tax ID: ${formData.taxId}`, 40, y);
    y += 15;
    doc.text(`Marital Status: ${formData.maritalStatus}`, 40, y);
    y += 20;

    // Check if new page is needed
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Spouse Details
    if (formData.maritalStatus === 'Married') {
      doc.setFontSize(14);
      doc.text('Spouse Details', 40, y);
      y += 20;
      doc.setFontSize(10);
      doc.text(`Name: ${formData.spouse.usedName}`, 40, y);
      y += 15;
      doc.text(`Birth Name: ${formData.spouse.birthName}`, 40, y);
      y += 15;
      doc.text(`First Names: ${formData.spouse.firstNames}`, 40, y);
      y += 15;
      doc.text(`Date of Birth: ${formData.spouse.dateOfBirth}`, 40, y);
      y += 15;
      doc.text(`Place of Birth: ${formData.spouse.placeOfBirth}`, 40, y);
      y += 15;
      doc.text(`Status: ${formData.spouse.status}`, 40, y);
      y += 15;
      doc.text(`Address: ${formData.spouse.street}, ${formData.spouse.city}, ${formData.spouse.state} ${formData.spouse.zip}, ${formData.spouse.country}`, 40, y);
      y += 15;
      doc.text(`Phone: ${formData.spouse.phone}`, 40, y);
      y += 15;
      doc.text(`Email: ${formData.spouse.email}`, 40, y);
      y += 20;
    }

    // Check if new page is needed
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Children
    doc.setFontSize(14);
    doc.text('Children', 40, y);
    y += 20;
    doc.setFontSize(10);
    if (formData.children.length === 0) {
      doc.text('No children listed.', 40, y);
      y += 15;
    } else {
      formData.children.forEach((child, index) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
        doc.text(`${index + 1}. ${child.firstNames}`, 40, y);
        y += 15;
        doc.text(`   Birth Name: ${child.birthName}`, 50, y);
        y += 15;
        doc.text(`   Used Name: ${child.usedName || 'N/A'}`, 50, y);
        y += 15;
        doc.text(`   Date of Birth: ${child.dateOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Place of Birth: ${child.placeOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Address: ${child.street}, ${child.city}, ${child.state} ${child.zip}, ${child.country}`, 50, y);
        y += 15;
        if (child.phone) {
          doc.text(`   Phone: ${child.phone}`, 50, y);
          y += 15;
        }
        if (child.email) {
          doc.text(`   Email: ${child.email}`, 50, y);
          y += 15;
        }
      });
    }
    y += 20;

    // Check if new page is needed
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Next of Kin
    doc.setFontSize(14);
    doc.text('Next of Kin', 40, y);
    y += 20;
    doc.setFontSize(10);
    if (formData.nextOfKin.length === 0) {
      doc.text('No next of kin listed.', 40, y);
      y += 15;
    } else {
      formData.nextOfKin.forEach((kin, index) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
        doc.text(`${index + 1}. ${kin.firstNames}`, 40, y);
        y += 15;
        doc.text(`   Birth Name: ${kin.birthName}`, 50, y);
        y += 15;
        doc.text(`   Used Name: ${kin.usedName || 'N/A'}`, 50, y);
        y += 15;
        doc.text(`   Date of Birth: ${kin.dateOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Place of Birth: ${kin.placeOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Relationship: ${kin.relationship}`, 50, y);
        y += 15;
        doc.text(`   Address: ${kin.street}, ${kin.city}, ${kin.state} ${kin.zip}, ${kin.country}`, 50, y);
        y += 15;
        doc.text(`   Phone: ${kin.phone}`, 50, y);
        y += 15;
        doc.text(`   Email: ${kin.email}`, 50, y);
        y += 15;
      });
    }
    y += 20;

    // Check if new page is needed
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Bank Accounts
    doc.setFontSize(14);
    doc.text('Bank Accounts', 40, y);
    y += 20;
    doc.setFontSize(10);
    if (formData.bankAccounts.length === 0) {
      doc.text('No bank accounts listed.', 40, y);
      y += 15;
    } else {
      formData.bankAccounts.forEach((account, index) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
        doc.text(`${index + 1}. ${account.accountName}`, 40, y);
        y += 15;
        doc.text(`   Bank Name: ${account.bankName}`, 50, y);
        y += 15;
        doc.text(`   Account Type: ${account.accountType}`, 50, y);
        y += 15;
        doc.text(`   Account Number: ${account.accountNumber}`, 50, y);
        y += 15;
        doc.text(`   Approx. Balance: $${parseFloat(account.approxBalance).toLocaleString('en-US')}`, 50, y);
        y += 15;
      });
    }

    // Save the PDF
    doc.save('PersonalDeclaration.pdf');

    setSuccess(t('declarationGenerated'));
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    console.error('Error generating PDF:', err);
    setError(t('declarationError'));
    setTimeout(() => setError(''), 3000);
  }

};

export { handleGenerateDeclaration };