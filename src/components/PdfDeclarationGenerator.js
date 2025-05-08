import { jsPDF } from 'jspdf';

const handleGenerateDeclaration = (formData, t, language, setSuccess, setError) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 50;

    // Title
    doc.setFontSize(20);
    doc.text('Déclaration d\'Informations Personnelles', 297.5, y, { align: 'center' });
    y += 20;
    doc.setFontSize(12);
    doc.text(`Préparé pour ${formData.firstNames} ${formData.usedName}`, 297.5, y, { align: 'center' });
    y += 15;
    doc.text(new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), 297.5, y, { align: 'center' });
    y += 30;

    // Personal Details
    doc.setFontSize(14);
    doc.text('Informations Personnelles', 40, y);
    y += 20;
    doc.setFontSize(10);
    doc.text(`Nom : ${formData.firstNames} ${formData.usedName}`, 40, y);
    y += 15;
    doc.text(`Nom de Naissance : ${formData.birthName}`, 40, y);
    y += 15;
    doc.text(`Date de Naissance : ${formData.dateOfBirth}`, 40, y);
    y += 15;
    doc.text(`Lieu de Naissance : ${formData.placeOfBirth}`, 40, y);
    y += 15;
    doc.text(`Statut : ${formData.status}`, 40, y);
    y += 15;
    doc.text(`Adresse : ${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`, 40, y);
    y += 15;
    doc.text(`Téléphone : ${formData.phone}`, 40, y);
    y += 15;
    doc.text(`Email : ${formData.email}`, 40, y);
    y += 15;
    doc.text(`Revenu Annuel : $${parseFloat(formData.annualIncome).toLocaleString('en-US')}`, 40, y);
    y += 15;
    doc.text(`Valeur Nette : $${parseFloat(formData.netWorth).toLocaleString('en-US')}`, 40, y);
    y += 15;
    doc.text(`Numéro Fiscal : ${formData.taxId}`, 40, y);
    y += 15;
    doc.text(`Statut Matrimonial : ${formData.maritalStatus}`, 40, y);
    y += 20;

    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Spouse Details
    if (formData.maritalStatus === 'Married') {
      doc.setFontSize(14);
      doc.text('Informations sur le Conjoint', 40, y);
      y += 20;
      doc.setFontSize(10);
      doc.text(`Nom : ${formData.spouse.usedName}`, 40, y);
      y += 15;
      doc.text(`Nom de Naissance : ${formData.spouse.birthName}`, 40, y);
      y += 15;
      doc.text(`Prénoms : ${formData.spouse.firstNames}`, 40, y);
      y += 15;
      doc.text(`Date de Naissance : ${formData.spouse.dateOfBirth}`, 40, y);
      y += 15;
      doc.text(`Lieu de Naissance : ${formData.spouse.placeOfBirth}`, 40, y);
      y += 15;
      doc.text(`Statut : ${formData.spouse.status}`, 40, y);
      y += 15;
      doc.text(`Adresse : ${formData.spouse.street}, ${formData.spouse.city}, ${formData.spouse.state} ${formData.spouse.zip}, ${formData.spouse.country}`, 40, y);
      y += 15;
      doc.text(`Téléphone : ${formData.spouse.phone}`, 40, y);
      y += 15;
      doc.text(`Email : ${formData.spouse.email}`, 40, y);
      y += 20;
    }

    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Children
    doc.setFontSize(14);
    doc.text('Enfants', 40, y);
    y += 20;
    doc.setFontSize(10);
    if (formData.children.length === 0) {
      doc.text('Aucun enfant répertorié.', 40, y);
      y += 15;
    } else {
      formData.children.forEach((child, index) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
        doc.text(`${index + 1}. ${child.firstNames}`, 40, y);
        y += 15;
        doc.text(`   Nom de Naissance : ${child.birthName}`, 50, y);
        y += 15;
        doc.text(`   Nom Usuel : ${child.usedName || 'N/A'}`, 50, y);
        y += 15;
        doc.text(`   Date de Naissance : ${child.dateOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Lieu de Naissance : ${child.placeOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Adresse : ${child.street}, ${child.city}, ${child.state} ${child.zip}, ${child.country}`, 50, y);
        y += 15;
        if (child.phone) {
          doc.text(`   Téléphone : ${child.phone}`, 50, y);
          y += 15;
        }
        if (child.email) {
          doc.text(`   Email : ${child.email}`, 50, y);
          y += 15;
        }
      });
    }
    y += 20;

    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Next of Kin
    doc.setFontSize(14);
    doc.text('Proche Parent', 40, y);
    y += 20;
    doc.setFontSize(10);
    if (formData.nextOfKin.length === 0) {
      doc.text('Aucun proche parent répertorié.', 40, y);
      y += 15;
    } else {
      formData.nextOfKin.forEach((kin, index) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
        doc.text(`${index + 1}. ${kin.firstNames}`, 40, y);
        y += 15;
        doc.text(`   Nom de Naissance : ${kin.birthName}`, 50, y);
        y += 15;
        doc.text(`   Nom Usuel : ${kin.usedName || 'N/A'}`, 50, y);
        y += 15;
        doc.text(`   Date de Naissance : ${kin.dateOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Lieu de Naissance : ${kin.placeOfBirth}`, 50, y);
        y += 15;
        doc.text(`   Relation : ${kin.relationship}`, 50, y);
        y += 15;
        doc.text(`   Adresse : ${kin.street}, ${kin.city}, ${kin.state} ${kin.zip}, ${kin.country}`, 50, y);
        y += 15;
        doc.text(`   Téléphone : ${kin.phone}`, 50, y);
        y += 15;
        doc.text(`   Email : ${kin.email}`, 50, y);
        y += 15;
      });
    }
    y += 20;

    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    // Bank Accounts
    doc.setFontSize(14);
    doc.text('Comptes Bancaires', 40, y);
    y += 20;
    doc.setFontSize(10);
    if (formData.bankAccounts.length === 0) {
      doc.text('Aucun compte bancaire répertorié.', 40, y);
      y += 15;
    } else {
      formData.bankAccounts.forEach((account, index) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
        doc.text(`${index + 1}. ${account.accountName}`, 40, y);
        y += 15;
        doc.text(`   Nom de la Banque : ${account.bankName}`, 50, y);
        y += 15;
        doc.text(`   Type de Compte : ${account.accountType}`, 50, y);
        y += 15;
        doc.text(`   Numéro de Compte : ${account.accountNumber}`, 50, y);
        y += 15;
        doc.text(`   Solde Approximatif : $${parseFloat(account.approxBalance).toLocaleString('en-US')}`, 50, y);
        y += 15;
      });
    }

    // Save the PDF
    doc.save('DeclarationPersonnelle.pdf');

    setSuccess(t('declarationGenerated'));
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    console.error('Erreur lors de la génération du PDF :', err);
    setError(t('declarationError'));
    setTimeout(() => setError(''), 3000);
  }

};

export { handleGenerateDeclaration };
