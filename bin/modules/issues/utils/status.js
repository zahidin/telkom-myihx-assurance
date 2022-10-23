const pending = (issueId) => {
  return {
    issueId: issueId,
    status: 'Pending',
    title: 'PENDING',
    text: 'Ticket has be created'
  };
};

const submited = (issueId, issueType, ticketType) => {
  return {
    issueId: issueId,
    issueType: issueType,
    ticketType: ticketType,
    status: 'SUBMITTED',
    title: 'Ticket Submitted',
    text: 'Ticket has been submitted. Our team is currently precessing your request',
  };
};

const received = (issueId, issueType, ticketType) => {
  return {
    issueId: issueId,
    issueType: issueType,
    ticketType: ticketType,
    status: 'RECEIVED',
    title: 'Report Received',
    text: 'We are trying to solve this issue',
  };
};

const assigned = (issueId, issueType, ticketType) => {
  return {
    issueId: issueId,
    issueType: issueType,
    ticketType: ticketType,
    status: 'ASSIGNED',
    title: 'Ticket Assigned',
    text: 'We have assigned a technician to your request',
  };
};

const inProgress = (issueId, issueType, ticketType) => {
  return {
    issueId: issueId,
    issueType: issueType,
    ticketType: ticketType,
    status: 'IN_PROGRESS',
    title: 'Repair In Progress',
    text: 'Our technician is arriving to your location'
  };
};

const completed = (issueId, issueType, ticketType) => {
  return {
    issueId: issueId,
    issueType: issueType,
    ticketType: ticketType,
    status: 'COMPLETED',
    title: 'Repair Complete',
    text: 'We have assigned a special team to resolve this issue'
  };
};

const resolved = (issueId, issueType, ticketType) => {
  return {
    issueId: issueId,
    issueType: issueType,
    ticketType: ticketType,
    status: 'RESOLVED',
    title: 'Issue solved',
    text: 'Issue has been resolved'
  };
};

const status = async (params, issueId, issueType, ticketType) => {
  switch (params) {
  case 'RESOLVED':
    return resolved(issueId, issueType, ticketType);
  case 'IN_PROGRESS':
    return inProgress(issueId, issueType, ticketType);
  case 'COMPLETED':
    return completed(issueId, issueType, ticketType);
  case 'ASSIGNED':
    return assigned(issueId, issueType, ticketType);
  case 'RECEIVED':
    return received(issueId, issueType, ticketType);
  default:
    return submited(issueId, issueType, ticketType);
  }
};

const categories = async (params) => {
  switch (params) {
  case 'ADMINISTRATION':
    return 'Admin';
  default:
    return 'Fisik';
  }
};

const messageOutstanding = async (params) => {
  switch (params) {
  case 'id':
    return {
      title: 'Anda belum melakukan pembayaran tagihan',
      description: 'Agar layanan dapat digunakan kembali silahkan melakukan pembayaran'
    };
  default:
    return {
      title: 'Sorry, you have an outstanding bill',
      description: 'In order yo use your service, please complete the payment'
    };
  }
};

module.exports = {
  status,
  pending,
  categories,
  messageOutstanding
};
