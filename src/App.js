// App.js
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const App = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [totalDataApi, setTotalDataApi] = useState('');
  const [totalDataDatabase, setTotalDataDatabase] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const modules = [
    { namaModul: 'dosen', keterangan: 'Dosen' },
    { namaModul: 'mahasiswa', keterangan: 'Mahasiswa' },
    { namaModul: 'kurikulum', keterangan: 'Kurikulum' },
    { namaModul: 'matakuliah', keterangan: 'Mata Kuliah' },
    { namaModul: 'akmmahasiswa', keterangan: 'AKM Mahasiswa' },
    { namaModul: 'jadwalperkuliahan', keterangan: 'Jadwal Perkuliahan' },
    { namaModul: 'jadwalujian', keterangan: 'Jadwal Ujian' },
    { namaModul: 'kelaskuliah', keterangan: 'Kelas Kuliah' },
    { namaModul: 'krsmahasiswa', keterangan: 'KRS Mahasiswa' },
    { namaModul: 'datapendaftar', keterangan: 'Data Pendaftar' },
    { namaModul: 'pesertaditerima', keterangan: 'Peserta Diterima' },
    { namaModul: 'pesertaregistrasi', keterangan: 'Peserta Registrasi' },
    { namaModul: 'pesertates', keterangan: 'Peserta Tes' },
    { namaModul: 'pesertaujian', keterangan: 'Peserta Ujian' },
    { namaModul: 'presensi', keterangan: 'Presensi' },
    { namaModul: 'rekappendaftar', keterangan: 'Rekap Pendaftar' },
    { namaModul: 'pendaftar', keterangan: 'Pendaftar' },
    { namaModul: 'dataperiode', keterangan: 'Data Periode' },
    { namaModul: 'periodedaftar', keterangan: 'Periode Pendaftaran' },
    { namaModul: 'gelombang', keterangan: 'Gelombang' },
    { namaModul: 'jalurpendaftaran', keterangan: 'Jalur Pendaftaran' },
    { namaModul: 'sistemkuliah', keterangan: 'Sistem Kuliah' },
    { namaModul: 'masterbank', keterangan: 'Switching Bank' }
  ];

  //fungsi jalankan modul
  const executeModule = async () => {
    try {
      setErrorMessage('');
      setMessage('');
      setTotalDataApi('');
      setTotalDataDatabase('');
      setLoading(true);

      const response = await axios.post(`http://localhost:3001/runModule/${selectedModule}`);

      if (response.data.success) {
        setMessage(response.data.message);
        setLoading(false);
        Swal.fire({
          text: `Proses migrasi data ${selectedModule} selesai.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }

    } catch (error) {
      const infoError = `Terjadi kesalahan saat menjalankan migrasi data ${selectedModule}: ${error.message}`
      console.error(infoError);
      setLoading(false);
      setErrorMessage(infoError)
    }
  };

  const checkTotalData = async () => {
    try {
      setMessage('');
      setErrorMessage('');
      setMessage('');
      setTotalDataApi('')
      setTotalDataDatabase('')
      setLoading(true);
      const response = await axios.post(`http://localhost:3001/cekTotalData/${selectedModule}`);
      // console.log("total data api:", response.data.totalDataApi);
      // console.log("total data database :", response.data.totalDataDatabase);
      setTotalDataApi(response.data.totalDataApi)
      setTotalDataDatabase(response.data.totalDataDatabase)

      setLoading(false);
    } catch (error) {
      const infoError = `Terjadi kesalahan saat memproses total data ${selectedModule}: ${error.message}`
      console.error(infoError);
      setLoading(false);
      setErrorMessage(infoError)
    }
  };

  const handleChangeDropdown = (e) => {
    setSelectedModule(e.target.value);
    setTotalDataApi('');
    setTotalDataDatabase('');
    setErrorMessage('');
    setMessage('');
  }

  const handleDeleteData = async () => {
    try {
      setErrorMessage('');
      setMessage('');
      setTotalDataApi('');
      setTotalDataDatabase('');

      // Tampilkan SweetAlert2 untuk konfirmasi penghapusan
      const result = await Swal.fire({
        text: `Apakah Anda yakin ingin menghapus data dari tabel ${selectedModule}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
      });

      // Jika pengguna mengkonfirmasi penghapusan
      if (result.isConfirmed) {
        setLoading(true);
        const response = await axios.delete(`http://localhost:3001/deleteData/${selectedModule}`);

        if (response.data.success) {
          // setMessage(response.data.message);
          setLoading(false);
          Swal.fire({
            text: `Data di tabel ${selectedModule} berhasil dihapus.`,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });
        }
      }

    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoading(false);
        setMessage(`Tidak ada data di tabel ${selectedModule}.`);
        Swal.fire({
          text: `Tidak ada data di tabel ${selectedModule}.`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else {
        setLoading(false);
        setErrorMessage(`Error saat menghapus data dari tabel ${selectedModule}: ${error.message}`);
      }
    }
  };


  return (
    <div className='container mt-5'>
      <h1 className="mb-4" style={{ textAlign: "center" }}>Migrasi Data Situ Sevima</h1>
      <div className='row'>
        <div className='col-lg-12'>
          <select className="form-select" id="moduleDropdown" aria-label="Default select example" onChange={handleChangeDropdown} value={selectedModule} disabled={loading}>
            <option value="">-- Pilih Modul --</option>
            {modules.map((module, index) => (
              <option key={index} value={module.namaModul}>
                {module.keterangan}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='row' style={{ marginTop: "20px" }}>
        <div className='col-md-4'>
          <button className="btn btn-primary" onClick={executeModule} disabled={!selectedModule || loading} style={{ marginBottom: "20px", marginRight: "20px", width: "100%" }}>
            Proses Migrasi Data
          </button>
        </div>
        <div className='col-md-4'>
          <button className="btn btn-success" onClick={checkTotalData} disabled={!selectedModule || loading} style={{ marginBottom: "20px", width: "100%" }}>
            Cek Total Data
          </button>
        </div>
        <div className='col-md-4'>
          <button className="btn btn-danger" onClick={handleDeleteData} disabled={!selectedModule || loading} style={{ marginBottom: "20px", width: "100%" }}>
            Hapus Data di Tabel
          </button>
        </div>
      </div>

      <div className='row'>
        {
          loading === true ?
            <div className="d-flex align-items-center">
              <button className="btn btn-secondary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" aria-hidden="true" style={{marginRight: "10px"}}></span>
                <span role="status">Loading...</span>
              </button>
            </div>
            :
            ""
        }

        {
          message && <p>{message}</p>
        }

        {
          errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>
        }

        {
          totalDataApi !== "" ?
            <p>
              <span>Total data di API: </span>
              <span className={`badge ${totalDataApi > totalDataDatabase ? 'bg-primary' : (totalDataApi < totalDataDatabase ? 'bg-primary' : 'bg-success')}`}>
                {totalDataApi.toLocaleString()}
              </span>
            </p>
            :
            ""
        }

        {
          totalDataDatabase !== "" ?
            <p>
              <span>Total data di database: </span>
              <span className={`badge ${totalDataApi > totalDataDatabase ? 'bg-danger' : (totalDataApi < totalDataDatabase ? 'bg-warning' : 'bg-success')}`}>
                {totalDataDatabase.toLocaleString()}
              </span>
            </p>
            :
            ""
        }
        {/* {
          totalDataApi && totalDataDatabase && totalDataApi === totalDataDatabase ? <p>Total data di API sama dengan total data di database.</p>
            :
            totalDataApi && totalDataDatabase && totalDataApi > totalDataDatabase ? <p>Total data di API lebih besar dari total data di database.</p>
              :
              totalDataApi && totalDataDatabase && totalDataApi < totalDataDatabase ? <p>Total data di database lebih besar dari total data di API.</p>
                :
                ""
        } */}
      </div>

    </div>
  );
};

export default App;