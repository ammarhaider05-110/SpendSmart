import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/transactions', { headers })
      setTransactions(response.data)
    } catch (err) {
      setError('Failed to load transactions')
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/transactions', {
        amount: parseFloat(amount),
        type: type,
        category: category,
        description: description
      }, { headers })
      setAmount('')
      setCategory('')
      setDescription('')
      fetchTransactions()
    } catch (err) {
      setError('Failed to add transaction')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/transactions/${id}`, { headers })
      fetchTransactions()
    } catch (err) {
      setError('Failed to delete transaction')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.logo}>SpendSmart</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
      </div>

      <div style={styles.content}>
        <div style={styles.statsRow}>
          <div style={{...styles.statCard, borderTop: '4px solid #2563eb'}}>
            <p style={styles.statLabel}>Balance</p>
            <p style={{...styles.statAmount, color: balance >= 0 ? '#16a34a' : '#dc2626'}}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div style={{...styles.statCard, borderTop: '4px solid #16a34a'}}>
            <p style={styles.statLabel}>Total Income</p>
            <p style={{...styles.statAmount, color: '#16a34a'}}>${totalIncome.toFixed(2)}</p>
          </div>
          <div style={{...styles.statCard, borderTop: '4px solid #dc2626'}}>
            <p style={styles.statLabel}>Total Expenses</p>
            <p style={{...styles.statAmount, color: '#dc2626'}}>${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div style={styles.mainRow}>
          <div style={styles.formCard}>
            <h2 style={styles.sectionTitle}>Add Transaction</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleAddTransaction}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount</label>
                <input
                  style={styles.input}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Type</label>
                <select
                  style={styles.input}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Category</label>
                <input
                  style={styles.input}
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="food, rent, salary..."
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description (optional)</label>
                <input
                  style={styles.input}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chipotle, Netflix..."
                />
              </div>
              <button style={styles.button} type="submit">Add Transaction</button>
            </form>
          </div>

          <div style={styles.listCard}>
            <h2 style={styles.sectionTitle}>Transactions</h2>
            {transactions.length === 0 ? (
              <p style={styles.empty}>No transactions yet. Add one!</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} style={styles.transactionItem}>
                  <div>
                    <p style={styles.transactionCategory}>{t.category}</p>
                    <p style={styles.transactionDescription}>{t.description}</p>
                  </div>
                  <div style={styles.transactionRight}>
                    <p style={{
                      ...styles.transactionAmount,
                      color: t.type === 'income' ? '#16a34a' : '#dc2626'
                    }}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </p>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  navbar: {
    backgroundColor: 'white',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logo: { fontSize: '22px', color: '#2563eb' },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  content: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  statLabel: { fontSize: '14px', color: '#666', marginBottom: '8px' },
  statAmount: { fontSize: '28px', fontWeight: 'bold' },
  mainRow: { display: 'flex', gap: '24px' },
  formCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    width: '380px',
    flexShrink: 0
  },
  listCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    flex: 1
  },
  sectionTitle: { fontSize: '18px', marginBottom: '20px', fontWeight: '600' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '8px'
  },
  error: { color: 'red', marginBottom: '16px', fontSize: '14px' },
  empty: { color: '#999', textAlign: 'center', marginTop: '40px' },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  transactionCategory: { fontWeight: '500', fontSize: '15px' },
  transactionDescription: { fontSize: '13px', color: '#999', marginTop: '2px' },
  transactionRight: { textAlign: 'right' },
  transactionAmount: { fontWeight: '600', fontSize: '16px' },
  deleteBtn: {
    marginTop: '4px',
    padding: '4px 10px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px'
  }
}

export default Dashboard