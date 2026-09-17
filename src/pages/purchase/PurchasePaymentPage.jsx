import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Clock,
  History,
  Eye,
  X,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  FileText,
  Lock,
  Building
} from 'lucide-react';
import { usePurchaseStorage } from '../../hooks/usePurchaseStorage';
import {
  PURCHASE_STORAGE_KEYS,
  advancePurchaseStage
} from '../../services/purchaseStorageService';

export function PurchasePaymentPage() {
  const indents = usePurchaseStorage(PURCHASE_STORAGE_KEYS.INDENTS, []);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"name":"Finance Officer"}');

  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [modalIndent, setModalIndent] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Form Fields
  const [billAmount, setBillAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [accountsOfficer, setAccountsOfficer] = useState(currentUser.name || 'Finance Lead');
  const [remarks, setRemarks] = useState('');

  // 1. Pending Payments
  const pendingIndents = useMemo(() => {
    return indents.filter((item) => {
      const isPending =
        item.currentStage === 'Payment' ||
        (item.currentStage !== 'Completed' && item.grnNumber && item.paymentStatus !== 'Paid');
      if (!isPending) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          (item.poNumber || '').toLowerCase().includes(q) ||
          (item.vendorName || '').toLowerCase().includes(q) ||
          (item.grnNumber || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [indents, searchTerm]);

  // 2. History Payments
  const historyIndents = useMemo(() => {
    return indents.filter((item) => {
      const hasHistory =
        item.paymentStatus === 'Paid' ||
        item.currentStage === 'Completed' ||
        (item.stageDetails && !!item.stageDetails['Payment']);

      if (!hasHistory) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          (item.poNumber || '').toLowerCase().includes(q) ||
          (item.vendorName || '').toLowerCase().includes(q) ||
          (item.transactionRef || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [indents, searchTerm]);

  const currentList = activeTab === 'pending' ? pendingIndents : historyIndents;

  const handleOpenAction = (indent, viewOnly = false) => {
    setModalIndent(indent);
    setIsViewOnly(viewOnly);

    const val = parseFloat(indent.totalBillAmount || indent.totalPOValue || indent.totalEstimatedValue || 10000);

    if (viewOnly && (indent.paymentStatus === 'Paid' || indent.transactionRef)) {
      setBillAmount(indent.totalBillAmount || val);
      setPaymentAmount(indent.paymentAmount || val);
      setPaymentMode(indent.paymentMode || 'Bank Transfer');
      setTransactionRef(indent.transactionRef || 'UTR-PUR-99881');
      setPaymentDate(indent.paymentDate || new Date().toISOString().split('T')[0]);
      setPaymentStatus(indent.paymentStatus || 'Paid');
      setAccountsOfficer(indent.accountsOfficer || 'Finance Lead');
      setRemarks(indent.paymentRemarks || '');
    } else {
      setBillAmount(val);
      setPaymentAmount(val);
      setPaymentMode('Bank Transfer');
      setTransactionRef(`UTR-PUR-${Math.floor(100000 + Math.random() * 900000)}`);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentStatus('Paid');
      setAccountsOfficer(currentUser.name || 'Finance Lead');
      setRemarks('Vendor tax invoice verified against GRN. Full payment cleared via corporate NEFT.');
    }
  };

  const handleCloseModal = () => {
    setModalIndent(null);
    setIsViewOnly(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!modalIndent) return;

    const payload = {
      totalBillAmount: parseFloat(billAmount || 0),
      paymentAmount: parseFloat(paymentAmount || 0),
      paymentMode,
      transactionRef,
      paymentDate,
      paymentStatus,
      accountsOfficer,
      paymentRemarks: remarks,
      nextStage: 'Completed',
      status: 'Procurement Closed',
    };

    advancePurchaseStage(
      modalIndent.id,
      payload,
      `Vendor payment cleared: ₹${paymentAmount} via ${paymentMode} (Ref: ${transactionRef})`
    );

    alert(`Vendor payment of ₹${paymentAmount} processed successfully! Procurement cycle complete.`);
    handleCloseModal();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-emerald-500/20">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-500/30">
            Procurement System • Step 9 (Final)
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-2">Vendor Payment</h1>
          <p className="text-xs text-slate-400 mt-1">Reconcile vendor tax invoices against GRNs, issue NEFT/RTGS disbursements, and close files.</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 flex space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending ({pendingIndents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Paid History ({historyIndents.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO #, Vendor, UTR #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {activeTab === 'pending' ? 'GRNs Pending Vendor Payment Clearance' : 'Disbursed Vendor Payments'} ({currentList.length})
          </h3>
        </div>

        {currentList.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 dark:text-slate-300">
              {activeTab === 'pending' ? 'No invoices currently pending payment' : 'No payment history records found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border-b">
                <tr>
                  <th className="p-3.5">PO Number</th>
                  <th className="p-3.5">GRN Ref</th>
                  <th className="p-3.5">Vendor Name</th>
                  <th className="p-3.5">Invoice Ref</th>
                  <th className="p-3.5 text-right">Bill Value (₹)</th>
                  <th className="p-3.5 text-right">Amount Paid (₹)</th>
                  <th className="p-3.5 text-center">Payment Status</th>
                  <th className="p-3.5 text-center">Payment Date</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentList.map((item) => {
                  const poNum = item.poNumber || `PO-Ref-${item.indentNumber}`;
                  const grn = item.grnNumber || 'GRN-Pending';
                  const billVal = parseFloat(item.totalBillAmount || item.totalPOValue || item.totalEstimatedValue || 0);
                  const paidVal = parseFloat(item.paymentAmount || (activeTab === 'history' ? billVal : 0));
                  const inv = item.vendorInvoiceNo || item.vendorBillNumber || `INV-${item.poNumber}`;
                  const st = item.paymentStatus || (activeTab === 'pending' ? 'Due' : 'Paid');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {poNum}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-semibold">{grn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.vendorName || 'Vendor'}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-medium">{inv}</td>
                      <td className="p-3.5 text-right font-extrabold text-slate-900 dark:text-white">
                        ₹ {billVal.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹ {paidVal.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            st === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {st}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-slate-500 font-medium">
                        {item.paymentDate || '-'}
                      </td>
                      <td className="p-3.5 text-center">
                        {activeTab === 'pending' ? (
                          <button
                            onClick={() => handleOpenAction(item, false)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center justify-center space-x-1 mx-auto transition-all cursor-pointer shadow-md shadow-amber-500/20"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Vendor</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAction(item, true)}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center space-x-1 mx-auto transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Voucher</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {modalIndent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                  {isViewOnly ? 'Vendor Payment Voucher (Read-Only)' : 'Disburse Vendor Payment'}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  PO: {modalIndent.poNumber} ({modalIndent.vendorName})
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">Vendor</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{modalIndent.vendorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">GRN Ref</span>
                  <span className="font-mono font-bold text-emerald-600">{modalIndent.grnNumber || 'GRN-OK'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Invoice Ref</span>
                  <span className="font-mono font-bold">{modalIndent.vendorInvoiceNo || modalIndent.vendorBillNumber || `INV-${modalIndent.poNumber}`}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">PO Value</span>
                  <span className="font-black text-emerald-600">
                    ₹ {parseFloat(modalIndent.totalPOValue || modalIndent.totalEstimatedValue || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Invoice Total Bill Amount (₹) *
                  </label>
                  {isViewOnly ? (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold">
                      ₹ {parseFloat(billAmount || 0).toLocaleString('en-IN')}
                    </div>
                  ) : (
                    <input
                      type="number"
                      required
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Payment Disbursed Amount (₹) *
                  </label>
                  {isViewOnly ? (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-xs font-black text-emerald-600">
                      ₹ {parseFloat(paymentAmount || 0).toLocaleString('en-IN')}
                    </div>
                  ) : (
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Payment Mode *
                  </label>
                  {isViewOnly ? (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold">
                      {paymentMode}
                    </div>
                  ) : (
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                      <option value="Corporate Cheque">Corporate Cheque</option>
                      <option value="UPI / Instant IMPS">UPI / Instant IMPS</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Transaction Ref / UTR / Cheque No *
                  </label>
                  {isViewOnly ? (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold text-indigo-600">
                      {transactionRef}
                    </div>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. UTR-PUR-998822"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Disbursement Date *
                  </label>
                  {isViewOnly ? (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold">
                      {paymentDate}
                    </div>
                  ) : (
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Accounts Officer
                </label>
                {isViewOnly ? (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold">
                    {accountsOfficer}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={accountsOfficer}
                    onChange={(e) => setAccountsOfficer(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Remarks
                </label>
                {isViewOnly ? (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-medium">
                    {remarks || 'None'}
                  </div>
                ) : (
                  <textarea
                    rows="2"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter ledger voucher notes or transaction remarks..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                {!isViewOnly && (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <span>Authorize Payment & Close File</span>
                    <Lock className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
